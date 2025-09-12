# Hornbill Furniture Website

A modern, responsive website for Hornbill Furniture Company built with React, Vite, and Tailwind CSS.

## 🚀 Features

- **Modern Design**: Clean, professional design with smooth animations and transitions
- **Responsive Layout**: Optimized for desktop, tablet, and mobile devices
- **Fast Performance**: Built with Vite for lightning-fast development and builds
- **SEO Optimized**: Semantic HTML structure and meta tags for better search engine visibility
- **Accessible**: WCAG compliant with proper ARIA labels and keyboard navigation

## 🛠️ Tech Stack

- **Frontend**: React 18 with React Router for navigation
- **Styling**: Tailwind CSS for utility-first styling
- **Icons**: Lucide React for beautiful, consistent icons
- **Build Tool**: Vite for fast development and optimized builds
- **Package Manager**: npm

## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js (version 16 or higher)
- npm (usually comes with Node.js)

## 🚀 Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```
   The website will be available at `http://localhost:3000`

3. **Build for Production**
   ```bash
   npm run build
   ```

4. **Preview Production Build**
   ```bash
   npm run preview
   ```

## 📁 Project Structure

```
hornbill-furniture-website/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   └── Footer.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── About.jsx
│   │   ├── Products.jsx
│   │   ├── Services.jsx
│   │   └── Contact.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## 🎨 Customization

### Colors
The website uses a custom color palette defined in `tailwind.config.js`:
- **Primary**: Blue shades for main branding
- **Accent**: Purple shades for highlights
- **Fonts**: Inter for body text, Poppins for headings

### Styling
Custom CSS classes are defined in `src/index.css`:
- `.btn-primary` - Primary button styling
- `.btn-secondary` - Secondary button styling
- `.section-padding` - Consistent section spacing
- `.container-custom` - Container with max-width and padding

## 📄 Pages

- **Home** (`/`) - Landing page with hero section and key features
- **About** (`/about`) - Company information and history (placeholder)
- **Products** (`/products`) - Furniture catalog and collections (placeholder)
- **Services** (`/services`) - Services offered by the company (placeholder)
- **Contact** (`/contact`) - Contact information and forms (placeholder)

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Adding New Pages

1. Create a new component in `src/pages/`
2. Import and add route in `src/App.jsx`
3. Add navigation link in `src/components/Navbar.jsx`

## 📞 Contact

For questions about this website project:
- Email: info@hornbillfurniture.com
- Phone: +1 (555) 123-4567

## 📝 License

This project is created for Hornbill Furniture Company. All rights reserved. 