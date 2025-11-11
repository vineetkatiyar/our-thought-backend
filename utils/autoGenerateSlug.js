import slugify from 'slugify';

export function generateSlug(title, options = {}) {
  const defaultOptions = {
    lower: true, // Convert to lowercase
    strict: true, // Strip special characters
    trim: true, // Remove leading/trailing spaces
    locale: 'en', // Default locale
  };

  return slugify(title, { ...defaultOptions, ...options });
}

export async function generateUniqueSlug(title, prisma, options = {}) {
  let baseSlug = generateSlug(title, options);
  let slug = baseSlug;
  let counter = 1;

  // Check if slug already exists
  while (true) {
    const existingStory = await prisma.story.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!existingStory) {
      break; // Slug is unique
    }

    // If slug exists, append counter
    slug = `${baseSlug}-${counter}`;
    counter++;

    // Safety check to prevent infinite loop
    if (counter > 100) {
      throw new Error('Could not generate unique slug after 100 attempts');
    }
  }

  return slug;
}

export const slugConfigs = {
  // English (default)
  english: {
    lower: true,
    strict: true,
    locale: 'en',
  },
  // Hindi support
  hindi: {
    lower: true,
    strict: true,
    locale: 'hi',
  },
  // Multi-language support
  multilingual: {
    lower: true,
    strict: false, // Less strict for multiple languages
    remove: /[*+~.()'"!:@]/g, // Custom remove pattern
  },
};
