import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url';

export const client = createClient({
  projectId: '4qp0efqy',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2025-09-01'
});

const builder = imageUrlBuilder(client);

export const urlFor = (source) => {
  return builder.image(source);
}
