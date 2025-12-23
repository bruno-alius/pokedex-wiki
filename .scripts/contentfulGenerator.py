import os
import re


def get_latest_contentful_export(directory="."):
    print(f"Searching in directory: {os.path.abspath(directory)}")
    files = [f for f in os.listdir(directory) if f.startswith("contentful-export")]
    if not files:
        print("No matching files found.")
        return None
    latest_file = sorted(files)[-1]  # Pick the last one alphabetically
    return latest_file

def remove_contentful_exports(directory="."):
    files = [f for f in os.listdir(directory) if f.startswith("contentful-export")]
    if not files:
        print("No files to remove.")
        return
    for file in files:
        os.remove(os.path.join(directory, file))
        print(f"Removed: {file}")

def transform_typescript_file(input_file, output_file, mapping_overrides=None):
    """
    Reads a TypeScript file with Contentful entry type interfaces and generates
    a new file where:
      - Each 'export interface Type<SomeName>Fields { ... }' is converted into a
        'export type <NewName> = { ... }'.
      - Occurrences of Entry<TypeXFields> in the body are replaced with just the new type name.
      - A ContentfulData type is dynamically generated listing all discovered types.
    Returns a list of discovered (new) type names.
    """
    if mapping_overrides is None:
        mapping_overrides = {"Cliente": "Client"}
    
    with open(input_file, "r") as file:
        content = file.read()
    
    # Remove header lines (e.g. lines starting with ">")
    content = "\n".join(line for line in content.splitlines() if not line.strip().startswith(">"))
    
    # Preserve import lines (assume they start with "import")
    imports = [line for line in content.splitlines() if line.strip().startswith("import")]
    
    # Regex to match interfaces like:
    # export interface TypeMainContentFields { ... }
    interface_pattern = r'export\s+interface\s+Type(\w+)Fields\s*\{([^}]*)\}'
    
    types = []  # List of tuples: (new_type_name, body)
    
    for match in re.finditer(interface_pattern, content, re.DOTALL):
        base = match.group(1).strip()           # e.g., "MainContent"
        body = match.group(2).strip()             # field definitions
        new_type = mapping_overrides.get(base, base)  # apply override if exists
        
        # Replace any occurrence of "Entry<TypeXFields>" with the new type name
        body = re.sub(
            r'Entry\s*<\s*Type(\w+)Fields\s*>',
            lambda m: mapping_overrides.get(m.group(1), m.group(1)),
            body
        )
        types.append((new_type, body))
    
    output_lines = []
    # Add unique import lines.
    for imp in sorted(set(imports)):
        imp = imp.replace(" Entry,", "")
        output_lines.append(imp)
    output_lines.append("")
    
    # Convert each discovered interface into a type definition.
    for new_type, body in types:
        # Ensure each property line ends with a semicolon.
        body_lines = []
        for line in body.splitlines():
            line = line.strip()
            if line and not line.endswith(";"):
                line += ";"
            body_lines.append("    " + line)
        body_str = "\n".join(body_lines)
        type_def = f"export type {new_type} = {{\n{body_str}\n}}"
        output_lines.append(type_def)
        output_lines.append("")
    
    # Dynamically create the ContentfulData type.
    output_lines.append("export type ContentfulData = {")
    for new_type, _ in types:
        key = new_type[0].lower() + new_type[1:] + "Entries"
        output_lines.append(f"    {key}: {new_type}[];")
    output_lines.append("}")
    
    output_content = "\n".join(output_lines)
    
    with open(output_file, "w") as file:
        file.write(output_content)
    
    print(f"Transformed TypeScript file saved as {output_file}")
    discovered_types = [t[0] for t in types]
    return discovered_types

def generate_contentful_loader(discovered_types, output_file):
    """
    Generates a TypeScript file that imports all discovered types (plus ContentfulData)
    from "@/types/ContentfulTypes" and creates two functions:
      - loadContentfulEntries<T>(entryType: string)
      - loadContentfulData(): Promise<ContentfulData>
    The loadContentfulData function dynamically builds its calls based on the discovered types.
    """

    # Build the import statement (ensuring ContentfulData is included)
    imported_types = ", ".join(discovered_types + ["ContentfulData"])
    
    # Generate entry loading logic
    load_entries_code = "\n".join(
        f"    const {type_name[0].lower() + type_name[1:]}Entries = await loadContentfulEntries<{type_name}>('{type_name[0].lower() + type_name[1:]}', locale);"
        for type_name in discovered_types
    )

    # Generate return object
    return_entries_code = "\n".join(
        f"        {type_name[0].lower() + type_name[1:]}Entries,"
        for type_name in discovered_types
    )

    # Construct the full TypeScript content
    output_content = f"""import {{ {imported_types} }} from "@/types/ContentfulTypes";
import {{ createClient }} from "contentful";
import {{languages}} from "@/pages/_app";

export async function loadContentfulEntries<T>(entryType: string, locale?: string) {{
    const client = createClient({{
        space: process.env.SPACE_ID || "",
        accessToken: process.env.ACCESS_TOKEN || "",
    }});

    try {{
        const response = await client.getEntries({{content_type: entryType, locale: locale}});
        return entryArrayToObjectArrayRecursive<T>(response.items);
    }} catch (error) {{
        console.error(`Error loading Contentful entries of type ${{entryType}}:`, error);
        return [];
    }}
}}


export async function loadContentfulLocales() {{
    const client = createClient({{
        space: process.env.SPACE_ID || "",
        accessToken: process.env.ACCESS_TOKEN || "",
    }});

    try {{
        return (await client.getLocales()).items;
    }} catch (error) {{
        console.error(`Error loading Contentful locales`, error);
        return [];
    }}
}}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
function entryArrayToObjectArrayRecursive<OutputType>(entryArray: any[]): OutputType[] {{
    return entryArray.map((entry) => {{
        if (entry?.sys?.type == 'Asset') {{
            return entry as unknown as OutputType;
        }}

        return entryToObjectRecursive<OutputType>(entry);
    }});
}}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function entryToObjectRecursive<OutputType>(entry: any): OutputType {{
    if (!entry.fields) {{
        return entry;
    }}
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const obj: any = entry.fields;

    Object.entries(entry.fields).forEach(([key, value]) => {{
        if (Array.isArray(value)) {{
            obj[key] = entryArrayToObjectArrayRecursive<typeof value>(value);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }} else if ((value as any).sys && (value as any).sys.type === 'Entry') {{
            obj[key] = entryToObjectRecursive<typeof value>(value);
        }}
    }});

    return obj as unknown as OutputType;
}}


export async function loadContentfulData(locale?: string): Promise<ContentfulData> {{
{load_entries_code}

    return {{
{return_entries_code}
    }};
}}

export async function loadContentfulMultilanguageData(): Promise<ContentfulData[]> {{
    const dataPromises = languages.map(language => loadContentfulData(language));
    return Promise.all(dataPromises);
}}
"""

    # Write to file
    with open(output_file, "w") as file:
        file.write(output_content)


def read_env_local(filename=".env.local"):
    env_vars = {}
    try:
        with open(filename, "r") as f:
            for line in f:
                line = line.strip()
                # Skip empty lines and comments
                if not line or line.startswith("#"):
                    continue
                key, sep, value = line.partition("=")
                if sep:
                    env_vars[key.strip()] = value.strip().strip('"').strip("'")
    except Exception as e:
        print(f"Error reading {filename}: {e}")
    return env_vars

def main():
    print('Hola, vamos a generar los tipos a partir de la conexión con Contentful')
    env_vars = read_env_local(".env.local")
    space_id = env_vars.get("SPACE_ID")
    os.system('contentful space export --space-id ' + space_id)
    os.system('npm run typegen ' + get_latest_contentful_export() + '> types/ContentfulTypes.temp')
    remove_contentful_exports()
    discovered_types = transform_typescript_file("types/ContentfulTypes.temp", "types/ContentfulTypes.ts")
    os.remove("types/ContentfulTypes.temp")
    
    # Generate the contentful loader file dynamically based on the discovered types
    loader_output_file = "contentfulLoader.ts"
    generate_contentful_loader(discovered_types, "utils\loaders\contentfulDataLoader.ts")

if __name__ == "__main__":
    main()
