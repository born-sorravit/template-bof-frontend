export type Product = {
  id: string
  name: string
  category: string
  price: number
  stock: number
  sku: string
}

const PRODUCTS: Product[] = [
  { id: "p-001", name: "Macbook Pro 16 inch (2021)", category: "Laptops", price: 2399, stock: 12, sku: "MBP-16-2021" },
  { id: "p-002", name: "DJI Mavic Pro 2", category: "Drones", price: 1599, stock: 4, sku: "DJI-MP2" },
  { id: "p-003", name: "Playstation 5 Limited Edition", category: "Consoles", price: 749, stock: 0, sku: "PS5-LE" },
  { id: "p-004", name: "Herman Miller Aeron, size B", category: "Furniture", price: 1245, stock: 7, sku: "HM-AER-B" },
  { id: "p-005", name: "Sony A7 III body only", category: "Cameras", price: 1799, stock: 3, sku: "SNY-A7III" },
  { id: "p-006", name: "Air Jordan 1 Top 3 (DS)", category: "Footwear", price: 429, stock: 21, sku: "AJ1-TOP3" },
  { id: "p-007", name: "Bose QC Ultra headphones", category: "Audio", price: 379, stock: 34, sku: "BOSE-QCU" },
  { id: "p-008", name: "Dyson V15 Detect Absolute", category: "Home", price: 749, stock: 9, sku: "DYS-V15" },
  { id: "p-009", name: "Technics SL-1200MK7", category: "Audio", price: 1099, stock: 2, sku: "TEC-1200" },
  { id: "p-010", name: "iPad Pro 12.9 M2", category: "Tablets", price: 1299, stock: 15, sku: "IPP-129-M2" },
  { id: "p-011", name: "Specialized Allez road bike", category: "Cycling", price: 1150, stock: 5, sku: "SPZ-ALLEZ" },
  { id: "p-012", name: "Nintendo Switch OLED", category: "Consoles", price: 349, stock: 28, sku: "NSW-OLED" },
]

export async function getProducts(): Promise<Product[]> {
  return PRODUCTS
}
