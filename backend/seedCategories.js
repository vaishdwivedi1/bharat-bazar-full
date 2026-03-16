// import fetch from "node-fetch";

// const token =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5YWUzNjRmNjEyMmZlM2ZhYmIzODFhNCIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc3MzAyNDg3NiwiZXhwIjoxNzczNjI5Njc2fQ.I1CrSkDjybZTi24aW6P8yeaozSCus3EqWIKB_MU34C4";

// const BASE_URL = "http://localhost:8080/api";

// // Add timeout to fetch requests
// const fetchWithTimeout = async (url, options, timeout = 30000) => {
//   const controller = new AbortController();
//   const id = setTimeout(() => controller.abort(), timeout);

//   try {
//     const response = await fetch(url, {
//       ...options,
//       signal: controller.signal,
//     });
//     clearTimeout(id);
//     return response;
//   } catch (error) {
//     clearTimeout(id);
//     throw error;
//   }
// };

// // Fetch all categories (public API)
// async function fetchCategories() {
//   try {
//     console.log("📦 Fetching categories...");
//     const response = await fetchWithTimeout(
//       `${BASE_URL}/category/v1/getAllCategory`,
//       {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       },
//     );

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const data = await response.json();
//     console.log(`✅ Found ${data.categories?.length || 0} categories`);
//     return data.categories || [];
//   } catch (error) {
//     console.error("Error fetching categories:", error.message);
//     return [];
//   }
// }

// // Fetch sellers from public API
// async function getSellerIds() {
//   try {
//     console.log("👥 Fetching sellers...");
//     const response = await fetchWithTimeout(`${BASE_URL}/auth/public/sellers`, {
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const data = await response.json();
//     console.log(`✅ Found ${data.sellers?.length || 0} sellers`);
//     return data.sellers || [];
//   } catch (error) {
//     console.error("Error fetching sellers:", error.message);
//     return [];
//   }
// }

// // Product templates for each category (same as before)
// const productTemplates = {
//   "Electronics & Electrical": [
//     {
//       name: "Samsung Galaxy S23 Ultra 5G",
//       shortDescription:
//         "Premium smartphone with 200MP camera and S Pen support",
//       longDescription:
//         "Experience the ultimate smartphone with 200MP camera, Snapdragon 8 Gen 2 processor, 5000mAh battery, and built-in S Pen. Perfect for photography enthusiasts and power users.",
//       pricingTiers: [
//         { minQuantity: 1, maxQuantity: 9, pricePerPiece: 124999 },
//         { minQuantity: 10, maxQuantity: 49, pricePerPiece: 119999 },
//         { minQuantity: 50, maxQuantity: 999, pricePerPiece: 114999 },
//       ],
//       minimumOrderQuantity: 1,
//       totalStock: 500,
//       gstRate: 18,
//       images: [
//         {
//           url: "https://www.arkema.com/files/live/sites/shared_arkema/files/images/markets/Electronics%20electrical/electronics.jpg",
//         },
//       ],
//     },
//     {
//       name: "iPhone 15 Pro Max Bulk Pack",
//       shortDescription: "Apple iPhone 15 Pro Max with A17 Pro chip",
//       longDescription:
//         "The most advanced iPhone ever with A17 Pro chip, titanium design, action button, and USB-C connectivity. Perfect for bulk orders and resellers.",
//       pricingTiers: [
//         { minQuantity: 1, maxQuantity: 4, pricePerPiece: 159900 },
//         { minQuantity: 5, maxQuantity: 19, pricePerPiece: 154900 },
//         { minQuantity: 20, maxQuantity: 99, pricePerPiece: 149900 },
//       ],
//       minimumOrderQuantity: 1,
//       totalStock: 250,
//       gstRate: 18,
//       images: [
//         {
//           url: "https://www.arkema.com/files/live/sites/shared_arkema/files/images/markets/Electronics%20electrical/electronics.jpg",
//         },
//       ],
//     },
//     {
//       name: "OnePlus Nord CE 3 Lite",
//       shortDescription: "Affordable 5G smartphone for bulk orders",
//       longDescription:
//         "OnePlus Nord CE 3 Lite with 108MP camera, 5000mAh battery, and 67W fast charging. Perfect for budget-conscious buyers and bulk resellers.",
//       pricingTiers: [
//         { minQuantity: 1, maxQuantity: 9, pricePerPiece: 19999 },
//         { minQuantity: 10, maxQuantity: 49, pricePerPiece: 18999 },
//         { minQuantity: 50, maxQuantity: 199, pricePerPiece: 17999 },
//       ],
//       minimumOrderQuantity: 1,
//       totalStock: 1000,
//       gstRate: 18,
//       images: [
//         {
//           url: "https://www.arkema.com/files/live/sites/shared_arkema/files/images/markets/Electronics%20electrical/electronics.jpg",
//         },
//       ],
//     },
//     {
//       name: "Gaming Laptop RTX 4070",
//       shortDescription: "High-performance gaming laptop with RTX 4070",
//       longDescription:
//         "ASUS ROG Strix gaming laptop with Intel i9 processor, NVIDIA RTX 4070 graphics, 32GB RAM, and 1TB SSD. Perfect for gaming enthusiasts and professionals.",
//       pricingTiers: [
//         { minQuantity: 1, maxQuantity: 2, pricePerPiece: 185000 },
//         { minQuantity: 3, maxQuantity: 9, pricePerPiece: 179000 },
//         { minQuantity: 10, maxQuantity: 49, pricePerPiece: 172000 },
//       ],
//       minimumOrderQuantity: 1,
//       totalStock: 75,
//       gstRate: 18,
//       images: [
//         {
//           url: "https://www.arkema.com/files/live/sites/shared_arkema/files/images/markets/Electronics%20electrical/electronics.jpg",
//         },
//       ],
//     },
//     {
//       name: "LED Panel Light 24W",
//       shortDescription: "Energy-efficient LED panel light for commercial use",
//       longDescription:
//         "24W LED panel light with 2400 lumens, cool white (6500K). Ideal for offices, commercial spaces, and bulk commercial orders.",
//       pricingTiers: [
//         { minQuantity: 10, maxQuantity: 99, pricePerPiece: 450 },
//         { minQuantity: 100, maxQuantity: 499, pricePerPiece: 399 },
//         { minQuantity: 500, maxQuantity: 9999, pricePerPiece: 349 },
//       ],
//       minimumOrderQuantity: 10,
//       totalStock: 5000,
//       gstRate: 12,
//       images: [
//         {
//           url: "https://www.arkema.com/files/live/sites/shared_arkema/files/images/markets/Electronics%20electrical/electronics.jpg",
//         },
//       ],
//     },
//   ],

//   "Textiles & Apparel": [
//     {
//       name: "Premium Cotton Fabric - Bulk Roll",
//       shortDescription: "High-quality cotton fabric for garments",
//       longDescription:
//         "Premium quality cotton fabric, 60-inch width, 140 GSM. Perfect for t-shirts, shirts, and casual wear. Available in multiple colors for bulk orders.",
//       pricingTiers: [
//         { minQuantity: 100, maxQuantity: 499, pricePerPiece: 120 },
//         { minQuantity: 500, maxQuantity: 1999, pricePerPiece: 110 },
//         { minQuantity: 2000, maxQuantity: 9999, pricePerPiece: 98 },
//       ],
//       minimumOrderQuantity: 100,
//       totalStock: 50000,
//       gstRate: 5,
//       images: [
//         {
//           url: "https://www.arkema.com/files/live/sites/shared_arkema/files/images/markets/Electronics%20electrical/electronics.jpg",
//         },
//       ],
//     },
//     {
//       name: "Men's Formal Shirts Bulk Pack",
//       shortDescription: "Premium formal shirts for corporate orders",
//       longDescription:
//         "High-quality formal shirts in slim fit, 100% cotton. Perfect for corporate uniforms, bulk orders, and retail. Available in sizes S-XXL and multiple colors.",
//       pricingTiers: [
//         { minQuantity: 50, maxQuantity: 199, pricePerPiece: 599 },
//         { minQuantity: 200, maxQuantity: 999, pricePerPiece: 549 },
//         { minQuantity: 1000, maxQuantity: 9999, pricePerPiece: 499 },
//       ],
//       minimumOrderQuantity: 50,
//       totalStock: 10000,
//       gstRate: 5,
//       images: [
//         {
//           url: "https://www.arkema.com/files/live/sites/shared_arkema/files/images/markets/Electronics%20electrical/electronics.jpg",
//         },
//       ],
//     },
//     {
//       name: "Traditional Silk Sarees Collection",
//       shortDescription: "Authentic silk sarees for wholesale",
//       longDescription:
//         "Beautiful collection of authentic silk sarees with zari work. Perfect for weddings, festivals, and bulk orders. Each piece comes with matching blouse piece.",
//       pricingTiers: [
//         { minQuantity: 10, maxQuantity: 49, pricePerPiece: 2499 },
//         { minQuantity: 50, maxQuantity: 199, pricePerPiece: 2299 },
//         { minQuantity: 200, maxQuantity: 999, pricePerPiece: 1999 },
//       ],
//       minimumOrderQuantity: 10,
//       totalStock: 2500,
//       gstRate: 5,
//       images: [
//         {
//           url: "https://www.arkema.com/files/live/sites/shared_arkema/files/images/markets/Electronics%20electrical/electronics.jpg",
//         },
//       ],
//     },
//   ],

//   "Industrial Supplies": [
//     {
//       name: "Industrial Safety Helmet",
//       shortDescription: "ISI marked safety helmets for industrial use",
//       longDescription:
//         "High-quality industrial safety helmets with adjustable headband, ISI marked. Ideal for construction sites, factories, and industrial applications.",
//       pricingTiers: [
//         { minQuantity: 50, maxQuantity: 199, pricePerPiece: 199 },
//         { minQuantity: 200, maxQuantity: 999, pricePerPiece: 179 },
//         { minQuantity: 1000, maxQuantity: 9999, pricePerPiece: 149 },
//       ],
//       minimumOrderQuantity: 50,
//       totalStock: 15000,
//       gstRate: 12,
//       images: [
//         {
//           url: "https://www.arkema.com/files/live/sites/shared_arkema/files/images/markets/Electronics%20electrical/electronics.jpg",
//         },
//       ],
//     },
//     {
//       name: "Cordless Power Drill Kit",
//       shortDescription: "Professional grade cordless drill set",
//       longDescription:
//         "18V cordless power drill kit with 2 batteries, charger, and 15-piece accessory set. Perfect for professionals and industrial use.",
//       pricingTiers: [
//         { minQuantity: 10, maxQuantity: 49, pricePerPiece: 3499 },
//         { minQuantity: 50, maxQuantity: 199, pricePerPiece: 3199 },
//         { minQuantity: 200, maxQuantity: 999, pricePerPiece: 2899 },
//       ],
//       minimumOrderQuantity: 10,
//       totalStock: 1000,
//       gstRate: 18,
//       images: [
//         {
//           url: "https://www.arkema.com/files/live/sites/shared_arkema/files/images/markets/Electronics%20electrical/electronics.jpg",
//         },
//       ],
//     },
//   ],

//   "Food & Agriculture": [
//     {
//       name: "Premium Basmati Rice - 25kg",
//       shortDescription: "Long grain premium basmati rice for bulk orders",
//       longDescription:
//         "Premium quality aged basmati rice, 1121 variety. Perfect for restaurants, hotels, and bulk buyers. Packed in 25kg bags.",
//       pricingTiers: [
//         { minQuantity: 10, maxQuantity: 49, pricePerPiece: 2250 },
//         { minQuantity: 50, maxQuantity: 199, pricePerPiece: 2100 },
//         { minQuantity: 200, maxQuantity: 999, pricePerPiece: 1950 },
//       ],
//       minimumOrderQuantity: 10,
//       totalStock: 5000,
//       gstRate: 5,
//       images: [
//         {
//           url: "https://www.arkema.com/files/live/sites/shared_arkema/files/images/markets/Electronics%20electrical/electronics.jpg",
//         },
//       ],
//     },
//     {
//       name: "Organic Turmeric Powder",
//       shortDescription: "Pure organic turmeric powder for bulk buyers",
//       longDescription:
//         "100% organic turmeric powder with high curcumin content. Perfect for food processing, hotels, and retail. Available in 1kg and 5kg packs.",
//       pricingTiers: [
//         { minQuantity: 50, maxQuantity: 199, pricePerPiece: 220 },
//         { minQuantity: 200, maxQuantity: 999, pricePerPiece: 200 },
//         { minQuantity: 1000, maxQuantity: 9999, pricePerPiece: 180 },
//       ],
//       minimumOrderQuantity: 50,
//       totalStock: 20000,
//       gstRate: 5,
//       images: [
//         {
//           url: "https://www.arkema.com/files/live/sites/shared_arkema/files/images/markets/Electronics%20electrical/electronics.jpg",
//         },
//       ],
//     },
//   ],

//   "Furniture & Decor": [
//     {
//       name: "Ergonomic Office Chair",
//       shortDescription: "Mesh back ergonomic office chair with lumbar support",
//       longDescription:
//         "High-back mesh ergonomic office chair with adjustable lumbar support, headrest, and armrests. Perfect for corporate offices and bulk orders.",
//       pricingTiers: [
//         { minQuantity: 10, maxQuantity: 49, pricePerPiece: 5499 },
//         { minQuantity: 50, maxQuantity: 199, pricePerPiece: 4999 },
//         { minQuantity: 200, maxQuantity: 999, pricePerPiece: 4499 },
//       ],
//       minimumOrderQuantity: 10,
//       totalStock: 750,
//       gstRate: 12,
//       images: [
//         {
//           url: "https://www.arkema.com/files/live/sites/shared_arkema/files/images/markets/Electronics%20electrical/electronics.jpg",
//         },
//       ],
//     },
//     {
//       name: "Modern Wall Art Set",
//       shortDescription: "Abstract canvas wall art set of 3 pieces",
//       longDescription:
//         "Modern abstract canvas wall art set of 3 pieces. Perfect for home decor, hotels, and office decoration. Available in multiple color combinations.",
//       pricingTiers: [
//         { minQuantity: 5, maxQuantity: 19, pricePerPiece: 3999 },
//         { minQuantity: 20, maxQuantity: 99, pricePerPiece: 3599 },
//         { minQuantity: 100, maxQuantity: 999, pricePerPiece: 3199 },
//       ],
//       minimumOrderQuantity: 5,
//       totalStock: 500,
//       gstRate: 12,
//       images: [
//         {
//           url: "https://www.arkema.com/files/live/sites/shared_arkema/files/images/markets/Electronics%20electrical/electronics.jpg",
//         },
//       ],
//     },
//   ],

//   "Health & Medical": [
//     {
//       name: "Digital Thermometer",
//       shortDescription: "Fast reading digital thermometer",
//       longDescription:
//         "Digital thermometer with 10-second reading, fever alert, and memory function. Perfect for hospitals, clinics, and medical stores.",
//       pricingTiers: [
//         { minQuantity: 50, maxQuantity: 199, pricePerPiece: 199 },
//         { minQuantity: 200, maxQuantity: 999, pricePerPiece: 179 },
//         { minQuantity: 1000, maxQuantity: 9999, pricePerPiece: 149 },
//       ],
//       minimumOrderQuantity: 50,
//       totalStock: 10000,
//       gstRate: 12,
//       images: [
//         {
//           url: "https://www.arkema.com/files/live/sites/shared_arkema/files/images/markets/Electronics%20electrical/electronics.jpg",
//         },
//       ],
//     },
//     {
//       name: "Surgical Face Masks - Pack of 100",
//       shortDescription: "3-ply surgical face masks for bulk orders",
//       longDescription:
//         "ASTM Level 3 surgical face masks with high bacterial filtration efficiency. Pack of 100 pieces, individually packed. Perfect for hospitals and bulk buyers.",
//       pricingTiers: [
//         { minQuantity: 10, maxQuantity: 99, pricePerPiece: 450 },
//         { minQuantity: 100, maxQuantity: 499, pricePerPiece: 399 },
//         { minQuantity: 500, maxQuantity: 9999, pricePerPiece: 349 },
//       ],
//       minimumOrderQuantity: 10,
//       totalStock: 50000,
//       gstRate: 12,
//       images: [
//         {
//           url: "https://www.arkema.com/files/live/sites/shared_arkema/files/images/markets/Electronics%20electrical/electronics.jpg",
//         },
//       ],
//     },
//   ],
// };

// async function createProducts() {
//   console.log("🚀 Starting product creation...");

//   // Fetch categories
//   const categories = await fetchCategories();
//   if (categories.length === 0) {
//     console.error("❌ No categories found. Please create categories first.");
//     return;
//   }

//   // Fetch sellers
//   const sellers = await getSellerIds();
//   if (sellers.length === 0) {
//     console.error("❌ No sellers found. Please create sellers first.");
//     console.log("\nTo create a seller, use:");
//     console.log("POST /api/auth/seller/v1/registerSeller");
//     return;
//   }

//   console.log(
//     `\n📊 Found ${categories.length} categories and ${sellers.length} sellers`,
//   );

//   let successCount = 0;
//   let failCount = 0;

//   // Create products for each category
//   for (const category of categories) {
//     const templateProducts = productTemplates[category.name];

//     if (!templateProducts) {
//       console.log(
//         `\n⚠️ No product templates for "${category.name}", skipping...`,
//       );
//       continue;
//     }

//     console.log(`\n📁 Creating products for "${category.name}"...`);

//     // Prepare ALL products for this category at once
//     const productsToCreate = [];

//     for (const template of templateProducts) {
//       // Randomly assign a seller
//       const seller = sellers[Math.floor(Math.random() * sellers.length)];

//       // Generate unique slug with timestamp
//       const baseSlug = template.name
//         .toLowerCase()
//         .replace(/[^a-z0-9]+/g, "-")
//         .replace(/(^-|-$)/g, "");
//       const uniqueSlug = `${baseSlug}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

//       productsToCreate.push({
//         ...template,
//         category: category._id,
//         seller: seller._id,
//         slug: uniqueSlug,
//         isActive: true,
//         isFeatured: Math.random() > 0.7,
//       });
//     }

//     // Send ALL products in one bulk request
//     console.log(`  📤 Creating ${productsToCreate.length} products in bulk...`);

//     try {
//       const response = await fetchWithTimeout(
//         `${BASE_URL}/products/v1/bulkCreateProducts`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({ products: productsToCreate }), // FIXED: Wrap in products array
//         },
//         60000, // Increased timeout to 60 seconds for bulk creation
//       );

//       const responseText = await response.text();

//       let data;
//       try {
//         data = JSON.parse(responseText);
//       } catch (e) {
//         console.log(`  ❌ Failed to parse response for "${category.name}"`);
//         console.log(`     Response preview: ${responseText.substring(0, 200)}`);
//         failCount += productsToCreate.length;
//         continue;
//       }

//       if (response.ok && data.success) {
//         console.log(
//           `  ✅ Successfully created ${data.created} products for "${category.name}"`,
//         );
//         successCount += data.created;
//         if (data.failed > 0) {
//           console.log(`  ⚠️ Failed to create ${data.failed} products`);
//           console.log("  Errors:", JSON.stringify(data.errors, null, 2));
//           failCount += data.failed;
//         }
//       } else {
//         console.log(
//           `  ❌ Failed to create products for "${category.name}": ${data.message || "Unknown error"}`,
//         );
//         failCount += productsToCreate.length;
//       }
//     } catch (error) {
//       if (error.name === "AbortError") {
//         console.log(
//           `  ❌ Timeout: Bulk creation for "${category.name}" took too long`,
//         );
//       } else {
//         console.log(
//           `  ❌ Error creating products for "${category.name}": ${error.message}`,
//         );
//       }
//       failCount += productsToCreate.length;
//     }

//     // Delay between categories
//     await new Promise((resolve) => setTimeout(resolve, 2000));
//   }

//   console.log("\n" + "=".repeat(50));
//   console.log(`🎉 Product Creation Complete!`);
//   console.log(`✅ Successfully created: ${successCount} products`);
//   console.log(`❌ Failed: ${failCount} products`);
//   console.log("=".repeat(50));
// }

// // Run the script
// createProducts().catch(console.error);

import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Seller Token
const SELLER_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5OWU2ZDNkYmI2OWQ0OWUwMTAxOWIzZSIsInJvbGUiOiJzZWxsZXIiLCJpYXQiOjE3NzM1ODQ0MTUsImV4cCI6MTc3NDE4OTIxNX0.KqJXSdYyD_ni4h8ZVuwXKYiSmSyPRCCwL23heFHLQ6o";

// API Base URL
const API_BASE_URL = "http://localhost:8080/api/category/v1/seller";

// Categories to create with ALL model fields
const categories = [
  {
    // Basic Info
    name: "Electronics",
    description:
      "All electronic items including smartphones, laptops, accessories, and gadgets",
    slug: "electronics",

    // Media
    image: "", // Will be handled by file upload
    icon: "💻",

    // Status Fields
    isFeatured: true,
    isActive: true,

    // Figma Fields
    productsCount: "0", // Will be updated automatically by system
    subcategories: [
      "Smartphones",
      "Laptops",
      "Accessories",
      "Audio",
      "Cameras",
      "Wearables",
    ],

    // Hierarchy
    parentCategory: null, // Top-level category
    level: 0,

    // Type & Seller
    type: "seller", // Will be set by backend
    // seller: Will be set by backend from token
  },
  {
    name: "Fashion",
    description: "Clothing, footwear, and accessories for men, women, and kids",
    slug: "fashion",
    image: "",
    icon: "👕",
    isFeatured: true,
    isActive: true,
    productsCount: "0",
    subcategories: [
      "Men's Clothing",
      "Women's Clothing",
      "Kids Wear",
      "Footwear",
      "Accessories",
      "Traditional Wear",
    ],
    parentCategory: null,
    level: 0,
    type: "seller",
  },
  {
    name: "Home & Living",
    description: "Furniture, home decor, kitchen appliances, bedding, and more",
    slug: "home-living",
    image: "",
    icon: "🏠",
    isFeatured: true,
    isActive: true,
    productsCount: "0",
    subcategories: [
      "Furniture",
      "Home Decor",
      "Kitchen & Dining",
      "Bedding",
      "Bath",
      "Storage & Organization",
    ],
    parentCategory: null,
    level: 0,
    type: "seller",
  },
  {
    name: "Beauty & Personal Care",
    description:
      "Cosmetics, skincare, haircare, fragrances, and personal grooming products",
    slug: "beauty-personal-care",
    image: "",
    icon: "💄",
    isFeatured: true,
    isActive: true,
    productsCount: "0",
    subcategories: [
      "Skincare",
      "Haircare",
      "Makeup",
      "Fragrances",
      "Bath & Body",
      "Men's Grooming",
    ],
    parentCategory: null,
    level: 0,
    type: "seller",
  },
  {
    name: "Sports & Fitness",
    description:
      "Sports equipment, gym accessories, fitness gear, and activewear",
    slug: "sports-fitness",
    image: "",
    icon: "⚽",
    isFeatured: false,
    isActive: true,
    productsCount: "0",
    subcategories: [
      "Exercise Equipment",
      "Team Sports",
      "Fitness Accessories",
      "Activewear",
      "Outdoor Sports",
      "Yoga",
    ],
    parentCategory: null,
    level: 0,
    type: "seller",
  },
  {
    name: "Books & Media",
    description: "Books, movies, music, and educational materials",
    slug: "books-media",
    image: "",
    icon: "📚",
    isFeatured: false,
    isActive: true,
    productsCount: "0",
    subcategories: [
      "Fiction Books",
      "Non-Fiction",
      "Children's Books",
      "Textbooks",
      "Movies",
      "Music",
    ],
    parentCategory: null,
    level: 0,
    type: "seller",
  },
  {
    name: "Toys & Games",
    description: "Toys, board games, video games, puzzles, and collectibles",
    slug: "toys-games",
    image: "",
    icon: "🧸",
    isFeatured: true,
    isActive: true,
    productsCount: "0",
    subcategories: [
      "Action Figures",
      "Board Games",
      "Video Games",
      "Puzzles",
      "Educational Toys",
      "Outdoor Play",
    ],
    parentCategory: null,
    level: 0,
    type: "seller",
  },
  {
    name: "Automotive",
    description:
      "Car accessories, tools, automotive parts, and maintenance products",
    slug: "automotive",
    image: "",
    icon: "🚗",
    isFeatured: false,
    isActive: true,
    productsCount: "0",
    subcategories: [
      "Car Accessories",
      "Tools & Equipment",
      "Parts & Spares",
      "Cleaning Supplies",
      "Oils & Fluids",
      "Interior Accessories",
    ],
    parentCategory: null,
    level: 0,
    type: "seller",
  },
  {
    name: "Health & Wellness",
    description:
      "Healthcare products, supplements, medical devices, and wellness items",
    slug: "health-wellness",
    image: "",
    icon: "💊",
    isFeatured: true,
    isActive: true,
    productsCount: "0",
    subcategories: [
      "Vitamins & Supplements",
      "Medical Supplies",
      "Personal Care",
      "Fitness Trackers",
      "First Aid",
      "Wellness Products",
    ],
    parentCategory: null,
    level: 0,
    type: "seller",
  },
  {
    name: "Pet Supplies",
    description: "Food, toys, accessories, and care products for pets",
    slug: "pet-supplies",
    image: "",
    icon: "🐾",
    isFeatured: false,
    isActive: true,
    productsCount: "0",
    subcategories: [
      "Dog Supplies",
      "Cat Supplies",
      "Fish & Aquarium",
      "Bird Supplies",
      "Pet Food",
      "Pet Accessories",
    ],
    parentCategory: null,
    level: 0,
    type: "seller",
  },
  {
    name: "Groceries & Gourmet",
    description: "Food items, beverages, snacks, and gourmet products",
    slug: "groceries-gourmet",
    image: "",
    icon: "🛒",
    isFeatured: true,
    isActive: true,
    productsCount: "0",
    subcategories: [
      "Snacks",
      "Beverages",
      "Pantry Staples",
      "Organic Foods",
      "Gourmet Foods",
      "International Foods",
    ],
    parentCategory: null,
    level: 0,
    type: "seller",
  },
  {
    name: "Baby Products",
    description:
      "Diapers, baby care, strollers, nursery items, and feeding essentials",
    slug: "baby-products",
    image: "",
    icon: "🍼",
    isFeatured: true,
    isActive: true,
    productsCount: "0",
    subcategories: [
      "Diapering",
      "Feeding",
      "Nursery",
      "Baby Gear",
      "Baby Care",
      "Toys & Activities",
    ],
    parentCategory: null,
    level: 0,
    type: "seller",
  },
  {
    name: "Jewelry",
    description: "Necklaces, rings, earrings, bracelets, and fashion jewelry",
    slug: "jewelry",
    image: "",
    icon: "💍",
    isFeatured: true,
    isActive: true,
    productsCount: "0",
    subcategories: [
      "Necklaces",
      "Rings",
      "Earrings",
      "Bracelets",
      "Gold Jewelry",
      "Silver Jewelry",
      "Fashion Jewelry",
    ],
    parentCategory: null,
    level: 0,
    type: "seller",
  },
  {
    name: "Watches",
    description:
      "Men's and women's watches, smartwatches, and watch accessories",
    slug: "watches",
    image: "",
    icon: "⌚",
    isFeatured: false,
    isActive: true,
    productsCount: "0",
    subcategories: [
      "Men's Watches",
      "Women's Watches",
      "Smartwatches",
      "Luxury Watches",
      "Watch Bands",
      "Watch Accessories",
    ],
    parentCategory: null,
    level: 0,
    type: "seller",
  },
  {
    name: "Bags & Luggage",
    description: "Backpacks, handbags, suitcases, travel bags, and wallets",
    slug: "bags-luggage",
    image: "",
    icon: "👜",
    isFeatured: false,
    isActive: true,
    productsCount: "0",
    subcategories: [
      "Backpacks",
      "Handbags",
      "Luggage",
      "Travel Bags",
      "Wallets",
      "Laptop Bags",
    ],
    parentCategory: null,
    level: 0,
    type: "seller",
  },
  {
    name: "Office Supplies",
    description: "Stationery, office equipment, supplies, and organization",
    slug: "office-supplies",
    image: "",
    icon: "📎",
    isFeatured: false,
    isActive: true,
    productsCount: "0",
    subcategories: [
      "Stationery",
      "Office Furniture",
      "Printer Supplies",
      "Desk Accessories",
      " Filing & Storage",
      "Writing Instruments",
    ],
    parentCategory: null,
    level: 0,
    type: "seller",
  },
  {
    name: "Musical Instruments",
    description: "Guitars, keyboards, drums, and musical accessories",
    slug: "musical-instruments",
    image: "",
    icon: "🎸",
    isFeatured: false,
    isActive: true,
    productsCount: "0",
    subcategories: [
      "Guitars",
      "Keyboards",
      "Drums",
      "Studio Equipment",
      "Accessories",
      "Sheet Music",
    ],
    parentCategory: null,
    level: 0,
    type: "seller",
  },
  {
    name: "Garden & Outdoor",
    description: "Gardening tools, plants, outdoor furniture, and landscaping",
    slug: "garden-outdoor",
    image: "",
    icon: "🌱",
    isFeatured: false,
    isActive: true,
    productsCount: "0",
    subcategories: [
      "Gardening Tools",
      "Plants & Seeds",
      "Outdoor Furniture",
      "Grills & Outdoor Cooking",
      "Pest Control",
      "Watering Equipment",
    ],
    parentCategory: null,
    level: 0,
    type: "seller",
  },
  {
    name: "Tools & Hardware",
    description:
      "Power tools, hand tools, hardware supplies, and workshop equipment",
    slug: "tools-hardware",
    image: "",
    icon: "🔧",
    isFeatured: false,
    isActive: true,
    productsCount: "0",
    subcategories: [
      "Power Tools",
      "Hand Tools",
      "Hardware",
      "Tool Storage",
      "Safety Equipment",
      "Electrical Tools",
    ],
    parentCategory: null,
    level: 0,
    type: "seller",
  },
  {
    name: "Party Supplies",
    description: "Decorations, party favors, tableware, and event supplies",
    slug: "party-supplies",
    image: "",
    icon: "🎉",
    isFeatured: false,
    isActive: true,
    productsCount: "0",
    subcategories: [
      "Decorations",
      "Party Favors",
      "Tableware",
      "Balloons",
      "Themed Parties",
      "Event Supplies",
    ],
    parentCategory: null,
    level: 0,
    type: "seller",
  },
  {
    name: "Art & Crafts",
    description: "Art supplies, craft materials, DIY kits, and hobby items",
    slug: "art-crafts",
    image: "",
    icon: "🎨",
    isFeatured: false,
    isActive: true,
    productsCount: "0",
    subcategories: [
      "Painting Supplies",
      "Drawing",
      "Sewing",
      "Knitting",
      "Scrapbooking",
      "DIY Kits",
    ],
    parentCategory: null,
    level: 0,
    type: "seller",
  },
  {
    name: "Industrial & Scientific",
    description: "Industrial equipment, scientific supplies, and labware",
    slug: "industrial-scientific",
    image: "",
    icon: "🔬",
    isFeatured: false,
    isActive: true,
    productsCount: "0",
    subcategories: [
      "Lab Equipment",
      "Industrial Tools",
      "Safety Supplies",
      "Testing Equipment",
      "Scientific Instruments",
    ],
    parentCategory: null,
    level: 0,
    type: "seller",
  },
];

// Download image function
async function downloadImage(url, filepath) {
  const response = await axios({
    url,
    method: "GET",
    responseType: "stream",
  });

  return new Promise((resolve, reject) => {
    const writer = fs.createWriteStream(filepath);
    response.data.pipe(writer);
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
}

// Create category function with ALL fields

async function createCategory(categoryData, imagePath) {
  try {
    const formData = new FormData();

    // Add ALL fields
    formData.append("name", categoryData.name);
    formData.append("description", categoryData.description);
    formData.append("slug", categoryData.slug);
    formData.append("icon", categoryData.icon);
    formData.append("isFeatured", categoryData.isFeatured.toString());
    formData.append("isActive", categoryData.isActive.toString());
    formData.append("productsCount", categoryData.productsCount);
    formData.append("level", categoryData.level.toString());

    // Send subcategories as JSON string
    formData.append(
      "subcategories",
      JSON.stringify(categoryData.subcategories),
    );

    // Add image
    if (fs.existsSync(imagePath)) {
      formData.append("image", fs.createReadStream(imagePath));
    }

    const response = await axios.post(
      `${API_BASE_URL}/add-category`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          Authorization: `Bearer ${SELLER_TOKEN}`,
        },
      },
    );

    console.log(`✅ Created: ${categoryData.name}`);
    return response.data;
  } catch (error) {
    console.error(
      `❌ Failed: ${categoryData.name}`,
      error.response?.data?.message || error.message,
    );
    return null;
  }
}

// Main function to run the script
async function createAllCategories() {
  console.log(
    "🚀 Starting category creation for seller with ALL model fields...\n",
  );
  console.log("=".repeat(60));

  // Create temp directory if it doesn't exist
  const tempDir = path.join(__dirname, "temp");
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }

  // Image URL to use for all categories
  const imageUrl =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROHxYft1f_Ln_y_scKnh8-g5rLMmce7JKyPQ&s";
  const imagePath = path.join(tempDir, "category-image.jpg");

  try {
    // Download the image once
    console.log("📥 Downloading category image...");
    await downloadImage(imageUrl, imagePath);
    console.log("✅ Image downloaded successfully\n");

    // Create categories one by one
    let successCount = 0;
    let failCount = 0;

    for (const [index, category] of categories.entries()) {
      console.log(
        `[${index + 1}/${categories.length}] Creating: ${category.name}`,
      );

      const result = await createCategory(category, imagePath);

      if (result) {
        successCount++;
      } else {
        failCount++;
      }

      // Small delay to avoid overwhelming the server
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    // Clean up temp files
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
    if (fs.existsSync(tempDir) && fs.readdirSync(tempDir).length === 0) {
      fs.rmdirSync(tempDir);
    }

    console.log("\n" + "=".repeat(60));
    console.log("📊 SUMMARY:");
    console.log("=".repeat(60));
    console.log(`✅ Successfully created: ${successCount} categories`);
    console.log(`❌ Failed: ${failCount} categories`);

    // Show featured categories count
    const featuredCount = categories.filter((c) => c.isFeatured).length;
    console.log(`⭐ Featured categories: ${featuredCount}`);

    // Show total subcategories
    const totalSubcategories = categories.reduce(
      (acc, cat) => acc + cat.subcategories.length,
      0,
    );
    console.log(`📋 Total subcategories: ${totalSubcategories}`);

    console.log("=".repeat(60));
    console.log("✨ Category creation completed!");
  } catch (error) {
    console.error("❌ Script failed:", error.message);

    // Clean up on error
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }
}

// Run the script
createAllCategories();
