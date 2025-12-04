import {
  addProduct,
  uploadImage,
  fetchProduct,
  updateProduct,
} from "../../services/api";
// The new, comprehensive content for AddProduct.tsx with image upload and variant management
import React, { useState, useRef, useEffect } from "react";
import { ArrowLeftIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useParams, useNavigate } from "react-router-dom";

// A simple reusable component for input fields with labels
const InputField = ({
  label,
  id,
  placeholder,
  type = "text",
  prefix,
}: {
  label: string;
  id: string;
  placeholder?: string;
  type?: string;
  prefix?: string;
}) => (
  <div>
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {label}
    </label>
    <div className="relative">
      {prefix && (
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
          {prefix}
        </span>
      )}
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        className={`w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
          prefix ? "pl-10" : ""
        }`}
      />
    </div>
  </div>
);

// Reusable checkbox component
const Checkbox = ({ label, id }: { label: string; id: string }) => (
  <div className="flex items-center">
    <input
      id={id}
      type="checkbox"
      className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
    />
    <label htmlFor={id} className="ml-2 block text-sm text-gray-900">
      {label}
    </label>
  </div>
);

import Notification from '../../components/Notification';

const AddProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [images, setImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [variants, setVariants] = useState<string[]>([]);
  const [availableSizes, setAvailableSizes] = useState([
    "XS",
    "S",
    "M",
    "L",
    "XL",
  ]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [status, setStatus] = useState("DRAFT");
  const [category, setCategory] = useState("1");
  const [notification, setNotification] = useState({ message: '', type: '' });
  const sizeOrder: { [key: string]: number } = {
    XS: 0,
    S: 1,
    M: 2,
    L: 3,
    XL: 4,
  };
  const [selectedVariants, setSelectedVariants] = useState<string[]>([]);

  useEffect(() => {
    if (id) {
      const loadProductData = async () => {
        try {
          const product = await fetchProduct(id);
          if (product) {
            // Populate state
            setStatus(product.status);
            setCategory(product.category_Id.toString());
            if (product.images && product.images.length > 0) {
              setImages(product.images.map((img: any) => img.url));
            }
            if (product.variants) {
              const variantSizes = product.variants.map((v: any) => v.size);
              setVariants(variantSizes);
              setAvailableSizes(
                availableSizes.filter((s) => !variantSizes.includes(s))
              );
            }

            // Populate uncontrolled inputs
            (document.getElementById("title") as HTMLInputElement).value =
              product.name || "";
            (
              document.getElementById("description") as HTMLTextAreaElement
            ).value = product.description || "";
            (document.getElementById("price") as HTMLInputElement).value =
              product.price?.toString() || "";
            (document.getElementById("offer_price") as HTMLInputElement).value =
              product.offer_price?.toString() || "";
            (document.getElementById("sku") as HTMLInputElement).value =
              product.varenummer || "";
            (document.getElementById("barcode") as HTMLInputElement).value =
              product.barkode || "";

            if (product.shipment_size) {
              (document.getElementById("weight") as HTMLInputElement).value =
                product.shipment_size.weight?.toString() || "";
              (document.getElementById("height") as HTMLInputElement).value =
                product.shipment_size.height?.toString() || "";
              (document.getElementById("width") as HTMLInputElement).value =
                product.shipment_size.width?.toString() || "";
            }
            
            setTimeout(() => {
              if (product.variants) {
                product.variants.forEach((variant: any) => {
                  const stockInput = document.getElementById(`stock-${variant.size}`) as HTMLInputElement;
                  if (stockInput) {
                    stockInput.value = variant.stock?.toString() || "";
                  }
                });
              }
            }, 100);
          }
        } catch (error) {
          console.error("Failed to fetch product data:", error);
          setNotification({ message: 'Kunne ikke hente produktdata.', type: 'error' });
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
        setNotification({ message: "Du kan maksimalt have 8 billeder per produkt.", type: 'error' });
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
          setNotification({ message: 'Fejl ved læsning af billeder.', type: 'error' });
        });
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const addVariant = (size: string) => {
    setVariants([...variants, size]);
    setAvailableSizes(availableSizes.filter((s) => s !== size));
    setIsDropdownOpen(false);
  };

  const removeVariant = (size: string) => {
    setVariants(variants.filter((v) => v !== size));
    setAvailableSizes([...availableSizes, size]);
    setSelectedVariants(selectedVariants.filter((sv) => sv !== size));
  };

  const handleSelectAllVariants = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedVariants(variants.map((v) => v));
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
    setSelectedVariants([]);
  };

  const handleSaveProduct = async () => {
    try {
      const finalImageUrls = await Promise.all(
        images.map(img => {
          if (img.startsWith("data:")) {
            return uploadImage(img).then(res => res.url);
          }
          return Promise.resolve(img);
        })
      );

      const imagesPayload = finalImageUrls.map((url, index) => ({
        url: url,
        isThumbnail: index === 0,
      }));

      const offerPriceValue = (
        document.getElementById("offer_price") as HTMLInputElement
      ).value;
      const weightValue = (
        document.getElementById("weight") as HTMLInputElement
      ).value;
      const heightValue = (
        document.getElementById("height") as HTMLInputElement
      ).value;
      const widthValue = (document.getElementById("width") as HTMLInputElement)
        .value;

      const productData = {
        name: (document.getElementById("title") as HTMLInputElement).value,
        description: (
          document.getElementById("description") as HTMLTextAreaElement
        ).value,
        price: parseFloat(
          (document.getElementById("price") as HTMLInputElement).value
        ),
        offer_price: offerPriceValue ? parseFloat(offerPriceValue) : null,
        status: status,
        category_Id: parseInt(category),
        varenummer: (document.getElementById("sku") as HTMLInputElement).value,
        barkode: (document.getElementById("barcode") as HTMLInputElement).value,
        images: imagesPayload,
        shipment_size: {
          weight: weightValue ? parseFloat(weightValue) : null,
          height: heightValue ? parseFloat(heightValue) : null,
          width: widthValue ? parseFloat(widthValue) : null,
        },
        variants: variants.map((size) => ({
          size: size,
          price: parseFloat(
            (document.getElementById(`price-${size}`) as HTMLInputElement)?.value || '0'
          ),
          stock: parseInt(
            (document.getElementById(`stock-${size}`) as HTMLInputElement)?.value || '0'
          ),
        })),
      };

      if (id) {
        await updateProduct(id, productData);
        setNotification({ message: 'Produkt opdateret!', type: 'success' });
      } else {
        await addProduct(productData);
        setNotification({ message: 'Produkt oprettet!', type: 'success' });
      }
      setTimeout(() => {
        navigate('/admin/all-products');
      }, 2000); // Navigate after 2 seconds
    } catch (error) {
      console.error("Failed to save product:", error);
      setNotification({ message: `Fejl: Kunne ikke gemme produktet.`, type: 'error' });
    }
  };

  const sortedVariants = variants
    .slice()
    .sort((a, b) => sizeOrder[a] - sizeOrder[b]);

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
       {notification.message && (
        <Notification
          message={notification.message}
          type={notification.type as 'success' | 'error'}
          onClose={() => setNotification({ message: '', type: '' })}
        />
      )}
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/admin/all-products')}
          className="p-2 rounded-full hover:bg-gray-200 mr-4"
        >
          <ArrowLeftIcon className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-fluidTitle font-semibold">{id ? 'Rediger' : 'Tilføj'} produkt</h1>
      </div>

      <div className="grid grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="col-span-2 flex flex-col gap-6">
          {/* Titel & Beskrivelse */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <InputField
              id="title"
              label="Titel"
              placeholder="Nordwear hoodie"
            />
            <div className="mt-4">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Beskrivelse
              </label>
              <textarea
                id="description"
                rows={8}
                className="w-full border-gray-300 rounded-md shadow-sm"
                placeholder="Nordwear hoodien er lavet i blød, behagelig kvalitet og har et enkelt, nordisk design..."
              ></textarea>
            </div>
          </div>

          {/* Medie */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Medie</h3>
            <p className="text-sm text-gray-500 mb-4">Første billede er thumbnail. Maks 8 billeder.</p>
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
                  className="relative aspect-square bg-gray-100 rounded-lg"
                >
                  <img
                    src={image}
                    alt={`Product image ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  {index === 0 && (
                     <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-bl-lg rounded-tr-lg">
                      Thumbnail
                    </div>
                  )}
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center"
                  >
                    X
                  </button>
                </div>
              ))}
              {images.length < 8 && (
              <div
                onClick={handleImageUploadClick}
                className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-center cursor-pointer hover:border-indigo-500"
              >
                <PlusIcon className="w-6 h-6 text-gray-400" />
                <p className="text-sm font-medium text-indigo-600 mt-2">
                  Tilføj billede
                </p>
              </div>
              )}
            </div>
          </div>

          {/* Variationer */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-800">Variationer</h3>
              <Checkbox
                id="has-variants"
                label="Dette produkt har flere variationer, som farve eller størrelse."
              />
            </div>
            <div className="flex items-center gap-2 mb-4 min-h-[2.25rem]">
              {" "}
              {sortedVariants.map((size) => (
                <span
                  key={size}
                  className="px-3 py-1 bg-gray-200 text-sm font-medium text-gray-700 rounded-full flex items-center"
                >
                  {size}
                  <button
                    onClick={() => removeVariant(size)}
                    className="ml-2 text-red-500"
                  >
                    x
                  </button>
                </span>
              ))}
            </div>
            <div className="relative inline-block">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:underline"
              >
                <PlusIcon className="w-4 h-4" /> Tilføj en størrelse
              </button>
              {isDropdownOpen && (
                <div className="absolute z-10 mt-2 w-48 bg-white rounded-md shadow-lg">
                  {availableSizes
                    .slice()
                    .sort((a, b) => sizeOrder[a] - sizeOrder[b])
                    .map((size) => (
                      <button
                        key={size}
                        onClick={() => addVariant(size)}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {size}
                      </button>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* Størrelser (Variants Table) */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-800">Størrelser</h3>
              {selectedVariants.length > 0 && (
                <button
                  onClick={handleDeleteSelectedVariants}
                  className="text-sm font-medium text-red-600 hover:underline"
                >
                  Slet valgte ({selectedVariants.length})
                </button>
              )}
            </div>
            {variants.length > 0 ? (
              <table className="w-full text-left">
                <thead>
                  <tr className="text-sm font-medium text-gray-500">
                    <th className="w-6 pr-2">
                      <input
                        type="checkbox"
                        className="rounded"
                        checked={
                          variants.length > 0 &&
                          selectedVariants.length === variants.length
                        }
                        onChange={handleSelectAllVariants}
                      />
                    </th>
                    <th className="py-2">Variant</th>
                    <th className="py-2">Pris</th>
                    <th className="py-2">Lager</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {sortedVariants.map((size) => (
                    <tr key={size} className="border-t border-gray-200">
                      <td className="pr-2 py-4">
                        <input
                          type="checkbox"
                          className="rounded"
                          checked={selectedVariants.includes(size)}
                          onChange={() => handleSelectVariant(size)}
                        />
                      </td>
                      <td className="py-2 flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-100 border rounded-md flex items-center justify-center cursor-pointer">
                          <PlusIcon className="w-5 h-5 text-gray-400" />
                        </div>
                        <span>{size}</span>
                      </td>
                      <td className="py-2">
                        <InputField
                          id={`price-${size}`}
                          prefix="kr."
                          placeholder="359"
                        />
                      </td>
                      <td className="py-2">
                        <InputField id={`stock-${size}`} placeholder="24" />
                      </td>
                      <td className="py-2">
                        <button className="text-sm font-medium text-indigo-600 hover:underline">
                          Ændrer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center text-gray-500 py-8">
                Tilføj venligst en størrelse for at se varianter.
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="col-span-1 flex flex-col gap-6">
          {/* Status */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Status</h3>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="DRAFT">Draft</option>
              <option value="ONLINE">Online</option>
              <option value="OFFLINE">Offline</option>
            </select>
            <div className="mt-4">
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="1">T-Shirts</option>
                <option value="2">Hoodies</option>
                <option value="3">Jackets</option>
                <option value="4">Pants</option>
              </select>
            </div>
          </div>

          {/* Pris */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Pris</h3>
            <div className="space-y-4">
              <InputField
                id="price"
                label="Pris"
                prefix="kr."
                placeholder="649"
              />
              <InputField
                id="offer_price"
                label="Tilbudspris"
                prefix="kr."
                placeholder="399"
              />
              <div className="border-t pt-4">
                <Checkbox id="add-vat" label="Tilføj moms på produkt" />
              </div>
              <InputField
                id="purchase_price"
                label="Indkøbspris"
                prefix="kr."
                placeholder="259"
              />
              <p className="text-xs text-gray-500">Kunder vil ikke se dette</p>
            </div>
          </div>

          {/* Lager */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Lager</h3>
            <div className="space-y-4">
              <InputField
                id="sku"
                label="Varenummer"
                placeholder="NW-HOODIE-BLK-M"
              />
              <InputField
                id="barcode"
                label="Barkode"
                placeholder="5701234567890"
              />
              <InputField
                id="stock_quantity"
                label="Varebeholdning"
                prefix="Stk."
                placeholder="21"
              />
              <div className="border-t pt-4 space-y-2">
                <Checkbox id="track-inventory" label="Spor lager" />
                <Checkbox
                  id="sell-when-out-of-stock"
                  label="Fortsæt med at sælge efter udsolgt lager"
                />
              </div>
            </div>
          </div>

          {/* Fragt */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Fragt</h3>
            <div className="space-y-4">
              <InputField id="weight" label="Vægt" placeholder="0.750" />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dimensioner
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    id="height"
                    label="Højde"
                    prefix="Cm."
                    placeholder="35"
                  />
                  <InputField
                    id="width"
                    label="Bredde"
                    prefix="Cm."
                    placeholder="44"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex justify-end gap-4 items-center">
        <button className="bg-white text-gray-700 py-2 px-4 rounded-md border border-gray-300 hover:bg-gray-50 text-sm font-medium">
          Arkiver produkt
        </button>
        <button className="text-red-600 hover:underline text-sm font-medium">
          Slet produkt
        </button>
        <button
          onClick={handleSaveProduct}
          className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 text-sm font-medium"
        >
          Gem produkt
        </button>
      </div>
    </div>
  );
};

export default AddProduct;

