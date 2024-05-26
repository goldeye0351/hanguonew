import { getRecordMap, mapImageUrl } from '@/libs/notion';
import { Post } from '@/types/post';
import { getBlurImage } from '@/utils/get-blur-image';

export async function getAllPostsFromNotion() {
  const allPosts: Post[] = [];
  const recordMap = await getRecordMap(process.env.NOTION_DATABASE_ID!);
  const { block, collection } = recordMap;
  const schema = Object.values(collection)[0].value.schema;
  const propertyMap: Record<string, string> = {};

  Object.keys(schema).forEach((key) => {
    propertyMap[schema[key].name] = key;
  });

  Object.keys(block).forEach((pageId) => {
    if (
      block[pageId].value.type === 'page' &&
      block[pageId].value.properties[propertyMap['slug']]
      &&block[pageId].value.properties[propertyMap['tags']]
    ) {
      const { properties, last_edited_time } = block[pageId].value;

      const contents = block[pageId].value.content || [];
      const dates = contents.map((content) => {
        return block[content]?.value?.last_edited_time;
      });
      dates.push(last_edited_time);
      dates.sort((a, b) => b - a);
      const lastEditedAt = dates[0];

      const id = pageId;
      const slug = properties[propertyMap['slug']][0][0];
      const title = properties[propertyMap['title']][0][0];
      const categories = properties[propertyMap['tags']][0][0].split(',');
      const cover = block[pageId].value?.format?.page_cover || 'https://51xmi.com/51.png';
      const date = properties[propertyMap['date']][0][1][0][1]['start_date'];
      const published = properties[propertyMap['status']][0][0] == 'Published';
      const emoji=block[pageId].value?.format?.page_icon 
      const link = properties[propertyMap['Link']];
      const summary = properties[propertyMap['summary']][0][0];
      const type = properties[propertyMap['type']];

      allPosts.push({
        id,
        emoji,link,summary,type,
        title,
        slug,
        categories,
        cover: mapImageUrl(cover, block[pageId].value) || '',
        date,
        published,
        lastEditedAt,
      });
    }
  });

  const blurImagesPromises = allPosts.map((post) => getBlurImage(post.cover));
  const blurImages = await Promise.all(blurImagesPromises);
  allPosts.forEach((post, i) => (post.blurUrl = blurImages[i].base64));

  return allPosts;
}
