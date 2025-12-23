import { GeneralContent, NewProject, Project, ContentfulData } from "@/types/ContentfulTypes";
import { createClient } from "contentful";
import {languages} from "@/pages/_app";

export async function loadContentfulEntries<T>(entryType: string, locale?: string) {
    const client = createClient({
        space: process.env.SPACE_ID || "",
        accessToken: process.env.ACCESS_TOKEN || "",
    });

    try {
        const response = await client.getEntries({content_type: entryType, locale: locale});
        return entryArrayToObjectArrayRecursive<T>(response.items);
    } catch (error) {
        console.error(`Error loading Contentful entries of type ${entryType}:`, error);
        return [];
    }
}


export async function loadContentfulLocales() {
    const client = createClient({
        space: process.env.SPACE_ID || "",
        accessToken: process.env.ACCESS_TOKEN || "",
    });

    try {
        return (await client.getLocales()).items;
    } catch (error) {
        console.error(`Error loading Contentful locales`, error);
        return [];
    }
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
function entryArrayToObjectArrayRecursive<OutputType>(entryArray: any[]): OutputType[] {
    return entryArray.map((entry) => {
        if (entry?.sys?.type == 'Asset') {
            return entry as unknown as OutputType;
        }

        return entryToObjectRecursive<OutputType>(entry);
    });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function entryToObjectRecursive<OutputType>(entry: any): OutputType {
    if (!entry.fields) {
        return entry;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const obj: any = entry.fields;

    Object.entries(entry.fields).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            obj[key] = entryArrayToObjectArrayRecursive<typeof value>(value);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } else if ((value as any).sys && (value as any).sys.type === 'Entry') {
            obj[key] = entryToObjectRecursive<typeof value>(value);
        }
    });

    return obj as unknown as OutputType;
}


export async function loadContentfulData(locale?: string): Promise<ContentfulData> {
    const generalContentEntries = await loadContentfulEntries<GeneralContent>('generalContent', locale);
    const newProjectEntries = await loadContentfulEntries<NewProject>('newProject', locale);
    const projectEntries = await loadContentfulEntries<Project>('project', locale);

    return {
        generalContentEntries,
        newProjectEntries,
        projectEntries,
    };
}

export async function loadContentfulMultilanguageData(): Promise<ContentfulData[]> {
    const dataPromises = languages.map(language => loadContentfulData(language));
    return Promise.all(dataPromises);
}
