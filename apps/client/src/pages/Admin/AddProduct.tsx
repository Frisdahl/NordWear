import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeftIcon,
  PlusIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import Notification from "@/components/Notification";
import {
  addProduct,
  uploadImage,
  fetchProduct,
  updateProduct,
} from "../../services/api";

const productActiveSvg = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6Z" /></svg>`;
const chevronRightSvg = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>`;

// Controlled InputField
const InputField = ({
  label,
  id,
  placeholder,
  type = "text",
  prefix,
  value,
  onChange,
}: {
  label: string;
  id: string;
  placeholder?: string;
  type?: string;
  prefix?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div className="flex flex-col gap-2">
    {label && (
      <label htmlFor={id} className="text-sm font-medium text-[#303030]">
        {label}
      </label>
    )}
    <div className="relative">
      {prefix && (
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#606060] text-sm">
          {prefix}
        </span>
      )}
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full h-10 px-3 border border-[#e6e6e6] rounded-lg focus:outline-none focus:border-[#303030] text-[#303030] ${
          prefix ? "pl-10" : ""
        }`}
      />
    </div>
  </div>
);

// Controlled Checkbox
const Checkbox = ({
  label,
  id,
  checked,
  onChange,
}: {
  label: string;
  id: string;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div className="flex items-center">
    <input
      id={id}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="h-4 w-4 text-[#303030] border-[#e6e6e6] rounded focus:ring-0 focus:ring-offset-0 cursor-pointer accent-[#303030]"
    />
    <label
      htmlFor={id}
      className="ml-2 block text-sm text-[#606060] cursor-pointer select-none"
    >
      {label}
    </label>
  </div>
);

const AddProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [sku, setSku] = useState("");
  const [barcode, setBarcode] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [width, setWidth] = useState("");

  // Checkbox States
  const [addVat, setAddVat] = useState(false);
  const [trackInventory, setTrackInventory] = useState(false);
  const [sellWhenOutOfStock, setSellWhenOutOfStock] = useState(false);
  const [hasVariants, setHasVariants] = useState(false);

  // Other States
  const [images, setImages] = useState<string[]>([]);
  const [status, setStatus] = useState("DRAFT");
  const [category, setCategory] = useState("1");
  const [variants, setVariants] = useState<string[]>([]);
  const [selectedVariants, setSelectedVariants] = useState<string[]>([]);
  const [variantDetails, setVariantDetails] = useState<{
    [key: string]: { price: string; stock: string };
  }>({});

  const [availableSizes, setAvailableSizes] = useState([
    "XS",
    "S",
    "M",
    "L",
    "XL",
  ]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "" });

  const sizeOrder: { [key: string]: number } = {
    XS: 0,
    S: 1,
    M: 2,
    L: 3,
    XL: 4,
  };

  useEffect(() => {
    if (id) {
      const loadProductData = async () => {
        try {
          const product = await fetchProduct(id);
          if (product) {
            // Populate basic fields
            setName(product.name || "");
            setDescription(product.description || "");
            setPrice(product.price?.toString() || "");
            setOfferPrice(product.offer_price?.toString() || "");
            setStatus(product.status);
            setCategory(product.category_Id.toString());
            setSku(product.varenummer || "");
            setBarcode(product.barkode || "");

            // Populate shipment details
            if (product.shipment_size) {
              setWeight(product.shipment_size.weight?.toString() || "");
              setHeight(product.shipment_size.height?.toString() || "");
              setWidth(product.shipment_size.width?.toString() || "");
            }

            // Populate images
            if (product.images && product.images.length > 0) {
              setImages(product.images.map((img: any) => img.url));
            }

            // Populate variants
            if (product.variants && product.variants.length > 0) {
              const variantSizes = product.variants.map((v: any) => v.size);
              setVariants(variantSizes);
              setHasVariants(true);
              setAvailableSizes((prev) =>
                prev.filter((s) => !variantSizes.includes(s))
              );

              const details: {
                [key: string]: { price: string; stock: string };
              } = {};
              product.variants.forEach((v: any) => {
                details[v.size] = {
                  price: v.price?.toString() || "",
                  stock: v.stock?.toString() || "",
                };
              });
              setVariantDetails(details);
            }
          }
        } catch (error) {
          console.error("Failed to fetch product data:", error);
          setNotification({
            message: "Kunne ikke hente produktdata.",
            type: "error",
          });
        }
      };
      loadProductData();
    }
  }, [id]);

  const handleImageUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      if (images.length + files.length > 8) {
        setNotification({
          message: "Du kan maksimalt have 8 billeder per produkt.",
          type: "error",
        });
        return;
      }
      const filePromises = Array.from(files).map((file) => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      });

      Promise.all(filePromises)
        .then((base64Images) => {
          setImages((prevImages) => [...prevImages, ...base64Images]);
        })
        .catch((error) => {
          console.error("Error reading files:", error);
          setNotification({
            message: "Fejl ved læsning af billeder.",
            type: "error",
          });
        });
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // Variant Logic
  const addVariant = (size: string) => {
    setVariants([...variants, size]);
    setAvailableSizes(availableSizes.filter((s) => s !== size));
    setVariantDetails({
      ...variantDetails,
      [size]: { price: "", stock: "" },
    });
    setIsDropdownOpen(false);
  };

  const removeVariant = (size: string) => {
    setVariants(variants.filter((v) => v !== size));
    setAvailableSizes([...availableSizes, size]);
    setSelectedVariants(selectedVariants.filter((sv) => sv !== size));
    const newDetails = { ...variantDetails };
    delete newDetails[size];
    setVariantDetails(newDetails);
  };

  const handleVariantDetailChange = (
    size: string,
    field: "price" | "stock",
    value: string
  ) => {
    setVariantDetails({
      ...variantDetails,
      [size]: {
        ...variantDetails[size],
        [field]: value,
      },
    });
  };

  const handleSelectAllVariants = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedVariants([...variants]);
    } else {
      setSelectedVariants([]);
    }
  };

  const handleSelectVariant = (size: string) => {
    if (selectedVariants.includes(size)) {
      setSelectedVariants(selectedVariants.filter((s) => s !== size));
    } else {
      setSelectedVariants([...selectedVariants, size]);
    }
  };

  const handleDeleteSelectedVariants = () => {
    const newVariants = variants.filter((v) => !selectedVariants.includes(v));
    const removedFromVariants = variants.filter((v) =>
      selectedVariants.includes(v)
    );
    setVariants(newVariants);
    setAvailableSizes([...availableSizes, ...removedFromVariants]);

    const newDetails = { ...variantDetails };
    selectedVariants.forEach((size) => delete newDetails[size]);
    setVariantDetails(newDetails);

    setSelectedVariants([]);
  };

  const handleSaveProduct = async () => {
    try {
      const finalImageUrls = await Promise.all(
        images.map((img) => {
          if (img.startsWith("data:")) {
            return uploadImage(img).then((res) => res.url);
          }
          return Promise.resolve(img);
        })
      );

      const imagesPayload = finalImageUrls.map((url, index) => ({
        url: url,
        isThumbnail: index === 0,
      }));

      const productData = {
        name,
        description,
        price: parseFloat(price) || 0,
        offer_price: offerPrice ? parseFloat(offerPrice) : null,
        status,
        category_Id: parseInt(category),
        varenummer: sku,
        barkode: barcode,
        images: imagesPayload,
        shipment_size: {
          weight: weight ? parseFloat(weight) : null,
          height: height ? parseFloat(height) : null,
          width: width ? parseFloat(width) : null,
        },
        variants: variants.map((size) => ({
          size: size,
          price: parseFloat(variantDetails[size]?.price || "0"),
          stock: parseInt(variantDetails[size]?.stock || "0"),
        })),
      };

      if (id) {
        await updateProduct(id, productData);
        setNotification({ message: "Produkt opdateret!", type: "success" });
      } else {
        await addProduct(productData);
        setNotification({ message: "Produkt oprettet!", type: "success" });
      }
      setTimeout(() => {
        navigate("/admin/all-products");
      }, 2000);
    } catch (error) {
      console.error("Failed to save product:", error);
      setNotification({
        message: `Fejl: Kunne ikke gemme produktet.`,
        type: "error",
      });
    }
  };

  const sortedVariants = variants
    .slice()
    .sort((a, b) => sizeOrder[a] - sizeOrder[b]);

  return (
    <div className="container mx-auto px-3 pt-8 min-h-screen relative pb-16">
      {notification.message && (
        <Notification
          message={notification.message}
          type={notification.type as "success" | "error"}
          onClose={() => setNotification({ message: "", type: "" })}
        />
      )}

      {/* Header */}
      <div className="flex items-center gap-2 mb-6 text-[#303030]">
        <div 
          onClick={() => navigate("/admin/all-products")} 
          className="cursor-pointer hover:bg-gray-200 transition-colors rounded-full p-2 flex items-center justify-center"
        >
          <Icon
            src={productActiveSvg}
            className="h-[1.5rem] w-[1.5rem]"
            strokeWidth={1.5}
          />
        </div>
        <Icon
          src={chevronRightSvg}
          className="h-4 w-4 text-gray-400"
          strokeWidth={2}
        />
        <h1 className="text-[1.5rem] font-bold">
          {id ? "Rediger produkt" : "Tilføj produkt"}
        </h1>
      </div>

      <div className="flex gap-6 items-start">
        {/* Left Column: Main Content */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Titel & Beskrivelse */}
          <div className="bg-white rounded-2xl border border-[#c7c7c7] p-8">
            <h2 className="text-base font-bold text-[#303030] mb-6">
              Generelt
            </h2>
            <InputField
              id="title"
              label="Titel"
              placeholder="Nordwear hoodie"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <div className="mt-6">
              <label
                htmlFor="description"
                className="text-sm font-medium text-[#303030] mb-2 block"
              >
                Beskrivelse
              </label>
              <textarea
                id="description"
                rows={8}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border border-[#e6e6e6] rounded-lg p-3 text-[#303030] focus:outline-none focus:border-[#303030]"
                placeholder="Nordwear hoodien er lavet i blød, behagelig kvalitet..."
              ></textarea>
            </div>
          </div>

          {/* Medie */}
          <div className="bg-white rounded-2xl border border-[#c7c7c7] p-8">
            <h3 className="text-base font-bold text-[#303030] mb-2">Medie</h3>
            <p className="text-sm text-[#606060] mb-6">
              Første billede er thumbnail. Maks 8 billeder.
            </p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
              multiple
            />
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
              {images.map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-square bg-[#f9f9f9] rounded-lg border border-[#e6e6e6]"
                >
                  <img
                    src={image}
                    alt={`Product image ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  {index === 0 && (
                    <div className="absolute bottom-0 left-0 bg-[#303030] text-white text-[10px] font-bold px-2 py-1 rounded-tr-lg rounded-bl-lg">
                      THUMBNAIL
                    </div>
                  )}
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-white border border-[#c7c7c7] text-[#303030] rounded-full p-1 w-6 h-6 flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-colors shadow-sm"
                  >
                    ×
                  </button>
                </div>
              ))}
              {images.length < 8 && (
                <div
                  onClick={handleImageUploadClick}
                  className="aspect-square border border-dashed border-[#c7c7c7] rounded-lg flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#303030] hover:bg-gray-50 transition-all group"
                >
                  <PlusIcon className="w-6 h-6 text-[#a0a0a0] group-hover:text-[#303030]" />
                  <p className="text-xs font-medium text-[#606060] mt-2 group-hover:text-[#303030]">
                    Tilføj billede
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Variationer */}
          <div className="bg-white rounded-2xl border border-[#c7c7c7] p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-bold text-[#303030]">
                Variationer
              </h3>
              <Checkbox
                id="has-variants"
                label="Dette produkt har flere variationer"
                checked={hasVariants}
                onChange={(e) => setHasVariants(e.target.checked)}
              />
            </div>

            <div className="flex items-center gap-2 mb-6 min-h-[2.5rem]">
              {sortedVariants.map((size) => (
                <span
                  key={size}
                  className="pl-3 pr-2 py-1 bg-[#f2f2f2] text-sm font-medium text-[#303030] rounded-lg flex items-center border border-[#e6e6e6]"
                >
                  {size}
                  <button
                    onClick={() => removeVariant(size)}
                    className="ml-2 text-[#a0a0a0] hover:text-red-600 px-1"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div className="relative inline-block mb-6">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 text-[13px] font-bold text-[#303030] bg-[#f2f2f2] hover:bg-[#e6e6e6] px-4 py-2 rounded-lg transition-colors"
              >
                <PlusIcon className="w-4 h-4" /> Tilføj størrelse
              </button>
              {isDropdownOpen && (
                <div className="absolute z-10 mt-2 w-48 bg-white rounded-xl shadow-lg border border-[#e6e6e6] overflow-hidden">
                  {availableSizes
                    .slice()
                    .sort((a, b) => sizeOrder[a] - sizeOrder[b])
                    .map((size) => (
                      <button
                        key={size}
                        onClick={() => addVariant(size)}
                        className="block w-full text-left px-4 py-2 text-sm text-[#303030] hover:bg-[#f9f9f9]"
                      >
                        {size}
                      </button>
                    ))}
                </div>
              )}
            </div>

            {/* Størrelser (Variants Table) */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-sm font-bold text-[#303030]">
                  Variant detaljer
                </h4>
                {selectedVariants.length > 0 && (
                  <button
                    onClick={handleDeleteSelectedVariants}
                    className="text-xs font-medium text-red-600 hover:underline"
                  >
                    Slet valgte ({selectedVariants.length})
                  </button>
                )}
              </div>

              {variants.length > 0 ? (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-xs font-medium text-[#a0a0a0] border-b border-[#e6e6e6]">
                      <th className="w-8 py-2 pl-2">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                          checked={
                            variants.length > 0 &&
                            selectedVariants.length === variants.length
                          }
                          onChange={handleSelectAllVariants}
                        />
                      </th>
                      <th className="py-2">Variant</th>
                      <th className="py-2 w-32">Pris (kr.)</th>
                      <th className="py-2 w-32">Lager</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedVariants.map((size) => (
                      <tr
                        key={size}
                        className="border-b border-[#f2f2f2] last:border-0"
                      >
                        <td className="py-4 pl-2">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300"
                            checked={selectedVariants.includes(size)}
                            onChange={() => handleSelectVariant(size)}
                          />
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#f9f9f9] border border-[#e6e6e6] rounded-lg flex items-center justify-center text-[#a0a0a0]">
                              <span className="text-xs font-bold">{size}</span>
                            </div>
                            <span className="text-sm font-medium text-[#303030]">
                              {size}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 pr-4">
                          <input
                            type="text"
                            placeholder="359"
                            value={variantDetails[size]?.price || ""}
                            onChange={(e) =>
                              handleVariantDetailChange(
                                size,
                                "price",
                                e.target.value
                              )
                            }
                            className="w-full h-9 px-2 border border-[#e6e6e6] rounded-md text-sm text-[#303030] focus:outline-none focus:border-[#303030]"
                          />
                        </td>
                        <td className="py-4 pr-4">
                          <input
                            type="text"
                            placeholder="24"
                            value={variantDetails[size]?.stock || ""}
                            onChange={(e) =>
                              handleVariantDetailChange(
                                size,
                                "stock",
                                e.target.value
                              )
                            }
                            className="w-full h-9 px-2 border border-[#e6e6e6] rounded-md text-sm text-[#303030] focus:outline-none focus:border-[#303030]"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="bg-[#f9f9f9] rounded-lg p-6 text-center border border-dashed border-[#c7c7c7]">
                  <p className="text-sm text-[#a0a0a0]">
                    Ingen varianter valgt endnu
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-3 mb-12">
            <button className="text-red-600 border border-red-600 px-6 h-10 rounded-lg hover:bg-red-50 text-sm font-medium transition-colors">
              Slet produkt
            </button>
            <Button
              variant="custom"
              className="bg-[#303030] text-white hover:bg-[#404040] rounded-lg h-10 px-6 text-[13px] font-medium"
              onClick={handleSaveProduct}
            >
              {id ? "Gem ændringer" : "Opret produkt"}
            </Button>
          </div>
        </div>

        {/* Right Column: Sidebar */}
        <div className="w-[350px] flex flex-col gap-6">
          {/* Status & Category */}
          <div className="bg-white rounded-2xl border border-[#c7c7c7] p-6">
            <h3 className="text-sm font-bold text-[#303030] mb-4">
              Organisering
            </h3>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="status"
                  className="text-sm font-medium text-[#303030]"
                >
                  Status
                </label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full h-10 px-3 border border-[#e6e6e6] rounded-lg bg-white focus:outline-none focus:border-[#303030] text-[#303030] appearance-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: "right 0.5rem center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "1.5em 1.5em",
                  }}
                >
                  <option value="DRAFT">Kladde</option>
                  <option value="ONLINE">Aktiv</option>
                  <option value="OFFLINE">Arkiveret</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="category"
                  className="text-sm font-medium text-[#303030]"
                >
                  Kategori
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-10 px-3 border border-[#e6e6e6] rounded-lg bg-white focus:outline-none focus:border-[#303030] text-[#303030] appearance-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: "right 0.5rem center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "1.5em 1.5em",
                  }}
                >
                  <option value="1">T-Shirts</option>
                  <option value="2">Hoodies</option>
                  <option value="3">Jackets</option>
                  <option value="4">Pants</option>
                </select>
              </div>
            </div>
          </div>

          {/* Pris */}
          <div className="bg-white rounded-2xl border border-[#c7c7c7] p-6">
            <h3 className="text-sm font-bold text-[#303030] mb-4">Priser</h3>
            <div className="flex flex-col gap-4">
              <InputField
                id="price"
                label="Pris"
                prefix="kr."
                placeholder="649"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              <InputField
                id="offer_price"
                label="Tilbudspris"
                prefix="kr."
                placeholder="399"
                value={offerPrice}
                onChange={(e) => setOfferPrice(e.target.value)}
              />
              <div className="pt-2">
                <Checkbox
                  id="add-vat"
                  label="Tilføj moms på produkt"
                  checked={addVat}
                  onChange={(e) => setAddVat(e.target.checked)}
                />
              </div>
              <div className="border-t border-[#e6e6e6] my-2"></div>
              <InputField
                id="purchase_price"
                label="Indkøbspris (kostpris)"
                prefix="kr."
                placeholder="259"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(e.target.value)}
              />
            </div>
          </div>

          {/* Lager */}
          <div className="bg-white rounded-2xl border border-[#c7c7c7] p-6">
            <h3 className="text-sm font-bold text-[#303030] mb-4">
              Lagerstyring
            </h3>
            <div className="flex flex-col gap-4">
              <InputField
                id="sku"
                label="Varenummer (SKU)"
                placeholder="NW-HOODIE-BLK-M"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
              />
              <InputField
                id="barcode"
                label="Barkode (EAN)"
                placeholder="5701234567890"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
              />
              <InputField
                id="stock_quantity"
                label="Varebeholdning"
                prefix="Stk."
                placeholder="21"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
              />
              <div className="pt-2 flex flex-col gap-2">
                <Checkbox
                  id="track-inventory"
                  label="Spor lager"
                  checked={trackInventory}
                  onChange={(e) => setTrackInventory(e.target.checked)}
                />
                <Checkbox
                  id="sell-when-out-of-stock"
                  label="Tillad salg når udsolgt"
                  checked={sellWhenOutOfStock}
                  onChange={(e) => setSellWhenOutOfStock(e.target.checked)}
                />
              </div>
            </div>
          </div>

          {/* Fragt */}
          <div className="bg-white rounded-2xl border border-[#c7c7c7] p-6">
            <h3 className="text-sm font-bold text-[#303030] mb-4">
              Fragt & Levering
            </h3>
            <div className="flex flex-col gap-4">
              <InputField
                id="weight"
                label="Vægt (kg)"
                placeholder="0.750"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
              <div>
                <label className="text-sm font-medium text-[#303030] mb-2 block">
                  Dimensioner
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <InputField
                    id="height"
                    label=""
                    prefix="H"
                    placeholder="35"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                  />
                  <InputField
                    id="width"
                    label=""
                    prefix="B"
                    placeholder="44"
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
