import { ContentfulData } from "@/types/ContentfulTypes";
import { getDefaultStaticProps, StaticPathsParams } from "@/utils/loaders/staticLoaders";


export async function getStaticProps(props: StaticPathsParams) {
  return getDefaultStaticProps(props);
}

export default function Home({ data }: { data: ContentfulData }) {
  return (
    <div>
      {JSON.stringify(data)}
    </div>
  );
}
