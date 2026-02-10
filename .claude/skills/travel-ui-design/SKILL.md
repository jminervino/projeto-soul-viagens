---
name: travel-ui-design
description: Create stunning UI components and pages for travel photo sharing social media app. Use this skill when building login screens, feed layouts, profile pages, photo galleries, upload flows, map integrations, stories, or any UI/UX design work related to travel content sharing. Triggers include requests for: design, interface, component, page, layout, styling, visual, aesthetic, or travel-specific features like location tags, photo cards, trip timelines, destination filters, and social interactions.
---

# Travel UI Design Skill

Expert skill for creating beautiful, performant UI components for a travel photo sharing social media application.

## Brand Identity

### Color Palette
```css
/* Primary Colors */
--sunset-orange: #FF6B35;  /* CTAs, highlights */
--sunset-pink: #FF8C69;    /* Gradients, accents */
--ocean-blue: #004E89;     /* Links, primary text */
--sky-blue: #1A8FE3;       /* Interactive elements */
--sand-cream: #FFF8F0;     /* Background */
--deep-navy: #001A2C;      /* Dark mode, contrast */

/* Neutrals */
--white: #FFFFFF;
--black: #1A1A1A;
--gray-50: #F9FAFB;
--gray-100: #F3F4F6;
--gray-200: #E5E7EB;
--gray-600: #4B5563;
--gray-900: #111827;
```

### Typography
```css
/* Display/Headlines */
font-family: 'Playfair Display', serif;
font-weight: 700, 800;
letter-spacing: -0.02em;

/* Body/UI */
font-family: 'Instrument Sans', sans-serif;
font-weight: 400, 500, 600, 700;
letter-spacing: -0.01em;
```

### Design Language
- **Organic & Rounded**: 12-16px border radius (never sharp corners)
- **Travel Inspired**: Use travel imagery, location pins, map aesthetics
- **Vibrant Gradients**: Sunset gradients (orange → pink) for CTAs
- **Micro-animations**: Subtle hover effects, smooth transitions
- **Photography First**: Large, beautiful images with subtle overlays

## Layout Principles

### Spacing Scale
Use Tailwind's spacing scale consistently:
- **Micro**: 4px, 8px (gaps between icons and text)
- **Small**: 12px, 16px (component padding)
- **Medium**: 24px, 32px (section spacing)
- **Large**: 48px, 64px (major sections)

### Grid System
```tsx
// Mobile: 1 column
// Tablet: 2 columns
// Desktop: 3 columns
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
```

### Container Widths
- Mobile: 100% with px-4
- Tablet: 100% with px-6
- Desktop: max-w-7xl mx-auto

## Component Library

### Buttons

#### Primary Button (CTA)
```tsx
<button className="
  h-12 px-6
  bg-gradient-to-r from-orange-500 to-pink-500
  hover:from-orange-600 hover:to-pink-600
  text-white font-semibold
  rounded-xl
  shadow-lg hover:shadow-xl
  transition-all duration-200
  hover:-translate-y-0.5
  active:translate-y-0
">
  Compartilhar Foto
</button>
```

#### Secondary Button
```tsx
<button className="
  h-12 px-6
  border-2 border-gray-200
  hover:border-gray-300 hover:bg-gray-50
  text-gray-900 font-semibold
  rounded-xl
  transition-all duration-200
">
  Cancelar
</button>
```

#### Icon Button
```tsx
<button className="
  w-10 h-10
  flex items-center justify-center
  hover:bg-gray-100
  rounded-xl
  transition-colors
">
  <HeartIcon className="w-5 h-5" />
</button>
```

### Input Fields

```tsx
<div className="relative">
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Email
  </label>
  <input 
    type="email"
    className="
      w-full h-12 px-4
      border-2 border-gray-200
      focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10
      rounded-xl
      text-gray-900 placeholder:text-gray-400
      transition-all
      outline-none
    "
    placeholder="seu@email.com"
  />
</div>
```

### Photo Card

The core component for the feed:

```tsx
interface PhotoCardProps {
  id: string;
  imageUrl: string;
  location: string;
  country: string;
  description?: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  author: {
    id: string;
    name: string;
    username: string;
    avatar: string;
  };
  createdAt: Date;
}

export function PhotoCard({ 
  imageUrl, 
  location, 
  country,
  description,
  likes, 
  comments,
  isLiked,
  author,
  createdAt
}: PhotoCardProps) {
  return (
    <article className="
      group
      bg-white rounded-2xl
      shadow-md hover:shadow-xl
      transition-all duration-300
      hover:-translate-y-1
      overflow-hidden
    ">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden">
        <Image 
          src={imageUrl}
          alt={`${location}, ${country}`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Gradient Overlay on Hover */}
        <div className="
          absolute inset-0
          bg-gradient-to-t from-black/60 via-black/0 to-transparent
          opacity-0 group-hover:opacity-100
          transition-opacity duration-300
        " />
        
        {/* Location Tag */}
        <div className="
          absolute bottom-4 left-4
          flex items-center gap-2
          bg-white/95 backdrop-blur-sm
          px-3 py-2 rounded-lg
          shadow-lg
        ">
          <MapPinIcon className="w-4 h-4 text-orange-500 flex-shrink-0" />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-900">
              {location}
            </span>
            <span className="text-xs text-gray-600">
              {country}
            </span>
          </div>
        </div>
        
        {/* Save Button (Top Right) */}
        <button className="
          absolute top-4 right-4
          w-10 h-10
          bg-white/90 backdrop-blur-sm
          rounded-full
          flex items-center justify-center
          opacity-0 group-hover:opacity-100
          transition-opacity
          hover:bg-white
          shadow-lg
        ">
          <BookmarkIcon className="w-5 h-5 text-gray-700" />
        </button>
      </div>
      
      {/* Content */}
      <div className="p-4">
        {/* Author Info */}
        <div className="flex items-center gap-3 mb-3">
          <Image 
            src={author.avatar}
            alt={author.name}
            width={40}
            height={40}
            className="rounded-full ring-2 ring-gray-100"
          />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 truncate">
              {author.name}
            </p>
            <p className="text-sm text-gray-500 truncate">
              @{author.username}
            </p>
          </div>
          <button className="
            px-4 py-1.5
            bg-orange-50 hover:bg-orange-100
            text-orange-600 text-sm font-medium
            rounded-lg
            transition-colors
          ">
            Seguir
          </button>
        </div>
        
        {/* Description */}
        {description && (
          <p className="text-sm text-gray-700 mb-3 line-clamp-2">
            {description}
          </p>
        )}
        
        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-4">
            {/* Like Button */}
            <button className={`
              flex items-center gap-2
              transition-colors
              ${isLiked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'}
            `}>
              <HeartIcon className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              <span className="text-sm font-medium">{likes}</span>
            </button>
            
            {/* Comment Button */}
            <button className="
              flex items-center gap-2
              text-gray-600 hover:text-sky-500
              transition-colors
            ">
              <ChatBubbleIcon className="w-5 h-5" />
              <span className="text-sm font-medium">{comments}</span>
            </button>
            
            {/* Share Button */}
            <button className="
              flex items-center gap-2
              text-gray-600 hover:text-orange-500
              transition-colors
            ">
              <ShareIcon className="w-5 h-5" />
            </button>
          </div>
          
          {/* Time */}
          <time className="text-xs text-gray-500">
            {formatRelativeTime(createdAt)}
          </time>
        </div>
      </div>
    </article>
  );
}
```

### Location Tag (Standalone)

```tsx
interface LocationTagProps {
  location: string;
  country: string;
  size?: 'sm' | 'md' | 'lg';
}

export function LocationTag({ location, country, size = 'md' }: LocationTagProps) {
  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-2.5 text-base'
  };
  
  return (
    <div className={`
      inline-flex items-center gap-2
      bg-white/95 backdrop-blur-sm
      ${sizes[size]}
      rounded-lg
      shadow-lg
    `}>
      <MapPinIcon className="w-4 h-4 text-orange-500 flex-shrink-0" />
      <div className="flex flex-col">
        <span className="font-semibold text-gray-900">
          {location}
        </span>
        <span className="text-xs text-gray-600">
          {country}
        </span>
      </div>
    </div>
  );
}
```

### Upload Button (FAB)

```tsx
export function UploadFAB() {
  return (
    <button className="
      fixed bottom-6 right-6 z-50
      w-16 h-16
      bg-gradient-to-br from-orange-500 to-pink-500
      hover:from-orange-600 hover:to-pink-600
      text-white
      rounded-full
      shadow-2xl hover:shadow-3xl
      flex items-center justify-center
      transition-all duration-300
      hover:scale-110
      active:scale-95
    ">
      <PlusIcon className="w-7 h-7" />
    </button>
  );
}
```

## Page Layouts

### Feed Page

```tsx
export default function FeedPage() {
  return (
    <div className="min-h-screen bg-sand-cream">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Logo />
          <Navigation />
          <UserMenu />
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stories */}
        <section className="mb-8">
          <StoriesCarousel />
        </section>
        
        {/* Filters */}
        <section className="mb-6">
          <DestinationFilters />
        </section>
        
        {/* Photo Grid */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos.map(photo => (
              <PhotoCard key={photo.id} {...photo} />
            ))}
          </div>
        </section>
      </main>
      
      {/* Upload FAB */}
      <UploadFAB />
    </div>
  );
}
```

## Animation Guidelines

### Hover Effects
```tsx
// Scale up slightly
className="hover:scale-105 transition-transform"

// Lift up
className="hover:-translate-y-1 transition-transform"

// Enhance shadow
className="shadow-md hover:shadow-xl transition-shadow"

// Color shift
className="text-gray-600 hover:text-orange-500 transition-colors"
```

### Loading States

#### Skeleton
```tsx
<div className="animate-pulse">
  <div className="aspect-square bg-gray-200 rounded-2xl mb-4" />
  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
  <div className="h-4 bg-gray-200 rounded w-1/2" />
</div>
```

#### Spinner
```tsx
<div className="w-6 h-6 border-3 border-gray-200 border-t-orange-500 rounded-full animate-spin" />
```

## Accessibility

### Focus Styles
```tsx
className="
  focus:outline-none
  focus:ring-4 focus:ring-orange-500/20
  focus:border-orange-500
"
```

### Screen Reader Text
```tsx
<span className="sr-only">
  Like this photo
</span>
```

### ARIA Labels
```tsx
<button aria-label="Like this photo from Paris">
  <HeartIcon />
</button>
```

## Mobile Considerations

### Touch Targets
Minimum 44x44px for all interactive elements.

### Bottom Navigation
```tsx
<nav className="
  fixed bottom-0 inset-x-0 z-40
  bg-white border-t border-gray-200
  safe-area-inset-bottom
">
  <div className="flex items-center justify-around h-16">
    {/* Navigation items */}
  </div>
</nav>
```

### Swipe Gestures
Use Framer Motion for swipe interactions:
```tsx
<motion.div
  drag="x"
  dragConstraints={{ left: 0, right: 0 }}
  onDragEnd={(e, info) => {
    if (info.offset.x > 100) handleSwipeRight();
    if (info.offset.x < -100) handleSwipeLeft();
  }}
>
```

## Best Practices

1. **Always use Next.js Image** for optimized images
2. **Implement loading states** for async operations
3. **Add error boundaries** for resilient UI
4. **Test on mobile devices** regularly
5. **Use semantic HTML** (article, section, nav)
6. **Implement dark mode** when applicable
7. **Optimize for performance** (lazy loading, code splitting)
8. **Follow accessibility guidelines** (WCAG 2.1 AA)

## Common Patterns

### Responsive Image Grid
```tsx
<div className="
  grid
  grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
  gap-4 sm:gap-6
">
```

### Modal/Dialog
```tsx
<Dialog>
  <div className="
    fixed inset-0 z-50
    flex items-center justify-center
    bg-black/50 backdrop-blur-sm
    p-4
  ">
    <div className="
      bg-white rounded-2xl
      max-w-lg w-full
      p-6
      shadow-2xl
    ">
      {/* Content */}
    </div>
  </div>
</Dialog>
```

### Toast Notification
```tsx
<div className="
  fixed bottom-6 right-6 z-50
  bg-white rounded-xl
  shadow-2xl
  p-4
  flex items-center gap-3
  animate-slide-in
">
  <CheckIcon className="w-5 h-5 text-green-500" />
  <p className="font-medium">Foto compartilhada!</p>
</div>
```

## Error States

```tsx
{error && (
  <div className="
    bg-red-50 border border-red-200
    rounded-xl p-4
    flex items-start gap-3
  ">
    <AlertIcon className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
    <div>
      <p className="font-medium text-red-900">
        Erro ao carregar fotos
      </p>
      <p className="text-sm text-red-700 mt-1">
        {error.message}
      </p>
    </div>
  </div>
)}
```

## Performance Tips

- Use `loading="lazy"` on images below the fold
- Implement infinite scroll with intersection observer
- Virtualize long lists (react-virtual)
- Debounce search inputs (300ms)
- Optimize images with Cloudflare Images
- Code split by route
- Memoize expensive calculations

## Questions to Ask

When implementing a feature, consider:
- Is this mobile-first?
- Does it have loading/error states?
- Is it accessible (keyboard nav, screen readers)?
- Does it follow the design system?
- Is it performant?
- Does it handle edge cases?
