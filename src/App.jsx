import { useState } from "react";
import { products, categories } from "./assets/data";
import {
  Cable,
  Headphones,
  Laptop,
  Mouse,
  Settings,
  TabletSmartphone,
} from "lucide-react";
import './App.css'

function CategoryIcon(category) {
  switch (category.icon) {
    case "mouse":
      return <Mouse className="h-5 w-5 text-blue-600" />;
    case "laptop":
      return <Laptop className="h-5 w-5 text-blue-600" />;
    case "tablet-smartphone":
      return <TabletSmartphone className="h-5 w-5 text-blue-600" />;
    case "headphones":
      return <Headphones className="h-5 w-5 text-blue-600" />;
    case "cable":
      return <Cable className="h-5 w-5 text-blue-600" />;
    default:
      return <Settings className="h-5 w-5 text-blue-600" />;
  }
}

export default function Home() {
  /**
   * Your code goes here.
   * Tailwind CSS has been installed and configured but it is not strictly required.
   */
  const [purchaseList, setPurchaseList] = useState([]);
  const [productList, setProductList] = useState(products);

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [amount, setAmount] = useState(0);
  const [error, setError] = useState(0);
  
  const filteredProducts =
    selectedCategory === "all"
      ? productList
      : productList.filter(
          (item) => item.category === Number(selectedCategory)
        );

  // Category changed
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setSelectedProduct("");
    setAmount(0);
    setError("");
  };

  // Product changed
  const handleProductChange = (e) => {
    setSelectedProduct(e.target.value);
    setAmount(0);
    setError("");
  };

// Add item
  const handleAddItem = () => {
    setError("");

    const product = productList.find(
      (item) => item.id === Number(selectedProduct)
    );

    if (!product) {
      setError("Please select a product.");
      return;
    }

    if (amount <= 0) {
      setError("Amount must be greater than 0.");
      return;
    }

    if (amount > product.inventory) {
      setError("Not enough inventory.");
      return;
    }

    // Update inventory
    const updatedProducts = productList.map((item) =>
      item.id === product.id
        ? {
            ...item,
            inventory: item.inventory - Number(amount),
          }
        : item
    );

    setProductList(updatedProducts);

    const existing = purchaseList.find(
      (item) => item.id === product.id
    );

    if (existing) {
      const updatedPurchase = purchaseList.map((item) =>
        item.id === product.id
          ? {
              ...item,
              amount: item.amount + Number(amount),
            }
          : item
      );

      setPurchaseList(updatedPurchase);
    } else {
      setPurchaseList([
        ...purchaseList,
        {
          ...product,
          amount: Number(amount),
        },
      ]);
    }

    setSelectedProduct("");
    setAmount(0);
  };

  // Grand Total
  const grandTotal = purchaseList.reduce((total, item) => {
    const subtotal =
      item.sellPrice *
      (1 - item.discount / 100) *
      item.amount;

    return total + subtotal;
  }, 0);



  return (
    <div>

      {/* Category */}
      <div className="mb-4">
        <label className="block font-semibold mb-2">
         Select Category
        </label>

        <select value={selectedCategory} onChange={handleCategoryChange} className="border rounded p-2 w-full">
          <option value="all">All</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.title}
            </option>
          ))}
        </select>
      </div>


      {/* Product */}
      <div className="mb-4">
        <label className="block font-semibold mb-2">
         Select Product
        </label>

        <select value={selectedProduct} onChange={handleProductChange} className="border rounded p-2 w-full">
          <option value="">
            Please Select An Item
          </option>

          {filteredProducts.map((product) => (
            <option key={product.id} value={product.id}>
              {product.title} ({product.inventory})
            </option>
          ))}
        </select>
      </div>


      {/* Amount */}
      <div className="mb-4">

        <label className="block font-semibold mb-2">
          Amount
        </label>

        <input
          type="number"
          value={amount}
          min="0"
          disabled={!selectedProduct}
          onChange={(e) =>
            setAmount(Number(e.target.value))
          }
          
        />

      </div>

      {/* Button */}

      <button
        onClick={handleAddItem}
        disabled={amount <= 0}
        className="bg-blue-600 text-white px-6 py-2 rounded disabled:bg-gray-400"
      >
        Add Item
      </button>

      {/* Error */}

      {error && (
        <div className="mt-4 text-red-600 font-semibold">
          {error}
        </div>
      )}

      {/* Purchase Table */}

      <table className="w-full mt-8 border">

        <thead className="bg-gray-100">

          <tr>

            <th className="border p-2">#</th>

            <th className="border p-2">
              Product ID
            </th>

            <th className="border p-2">
              Product
            </th>

            <th className="border p-2">
              Category
            </th>

            <th className="border p-2">
              Price
            </th>

            <th className="border p-2">
              Discount
            </th>

            <th className="border p-2">
              Amount
            </th>

            <th className="border p-2">
              Subtotal
            </th>

          </tr>

        </thead>

        <tbody>

          {purchaseList.map((item, index) => {

            const category = categories.find(
              (c) => c.id === item.category
            );

            const subtotal =
              item.sellPrice *
              (1 - item.discount / 100) *
              item.amount;

            return (

              <tr key={item.id}>

                <td className="border p-2">
                  {index + 1}
                </td>

                <td className="border p-2">
                  {item.id}
                </td>

                <td className="border p-2">
                  {item.title}
                </td>

                <td className="border p-2 text-center">
                  {CategoryIcon(category)}
                </td>

                <td className="border p-2">
                  {item.sellPrice}
                </td>

                <td className="border p-2">
                  {item.discount}%
                </td>

                <td className="border p-2">
                  {item.amount}
                </td>

                <td className="border p-2">
                  {subtotal.toFixed(2)}
                </td>

              </tr>

            );

          })}

        </tbody>

      </table>

      {/* Grand Total */}

      <div className="text-right mt-6 text-2xl font-bold">

        Grand Total :
        {" "}
        {grandTotal.toFixed(2)}
        {" "}
        THB

      </div>

    </div>
  );

}
