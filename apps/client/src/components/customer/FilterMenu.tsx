import React, { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Accordion from "../Accordion";
import { fetchCategories, fetchSizes } from "../../services/api";
import { Category, Size } from "../../types";
import Slider from "@mui/material/Slider";

interface FilterMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: {
    priceRange: [number, number];
    categories: number[];
    sizes: number[];
  }) => void;
}

const FilterMenu: React.FC<FilterMenuProps> = ({
  isOpen,
  onClose,
  onApply,
}) => {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2499]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<number[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [fetchedCategories, fetchedSizes] = await Promise.all([
          fetchCategories(),
          fetchSizes(),
        ]);
        setCategories(fetchedCategories);
        setSizes(fetchedSizes);
      } catch (error) {
        console.error("Failed to fetch filter data:", error);
      }
    };

    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const handleCategoryChange = (categoryId: number) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSizeChange = (sizeId: number) => {
    setSelectedSizes((prev) =>
      prev.includes(sizeId)
        ? prev.filter((id) => id !== sizeId)
        : [...prev, sizeId]
    );
  };

  const handleApply = () => {
    onApply({
      priceRange,
      categories: selectedCategories,
      sizes: selectedSizes,
    });
    onClose();
  };

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setPriceRange(newValue as [number, number]);
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-75 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      ></div>

      <div
        className={`fixed top-0 right-0 h-full w-[90%] md:w-[30%] bg-white z-50 shadow-lg transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 flex justify-between items-center border-b">
          <h2 className="text-lg font-serif">Filtrer</h2>
          <button onClick={onClose}>
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="p-4">
          <Accordion
            title="Pris"
            content={
              <div className="pt-8 px-4">
                <Slider
                  getAriaLabel={() => "Price range"}
                  value={priceRange}
                  onChange={handleSliderChange}
                  valueLabelDisplay="auto"
                  min={0}
                  max={2499}
                  sx={{
                    color: "#1c1c1c",
                    "& .MuiSlider-thumb": {
                      width: 20,
                      height: 20,
                    },
                  }}
                />
                <div className="flex justify-between mt-2 text-sm">
                  <span>kr. {priceRange[0]}</span>
                  <span>kr. {priceRange[1]}</span>
                </div>
                <div className="flex justify-between mt-4 space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange[0]}
                    onChange={(e) =>
                      setPriceRange([+e.target.value, priceRange[1]])
                    }
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], +e.target.value])
                    }
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
            }
          />
          <Accordion
            title="Produkttype"
            content={
              <div className="pt-4 space-y-2">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center cursor-pointer"
                    onClick={() => handleCategoryChange(category.id)}
                  >
                    <div
                      className={`transition-all duration-300 flex items-center justify-center ${
                        selectedCategories.includes(category.id) ? "w-6" : "w-0"
                      }`}
                    >
                      <div
                        className={`h-1.5 w-1.5 rounded-full bg-black transition-opacity duration-300 ${
                          selectedCategories.includes(category.id)
                            ? "opacity-100"
                            : "opacity-0"
                        }`}
                      ></div>
                    </div>
                    <span className="ml-2">{category.name}</span>
                  </div>
                ))}
              </div>
            }
          />
          <Accordion
            title="Størrelse"
            content={
              <div className="pt-4 space-y-2">
                {sizes.map((size) => (
                  <div
                    key={size.id}
                    className="flex items-center cursor-pointer"
                    onClick={() => handleSizeChange(size.id)}
                  >
                    <div
                      className={`transition-all duration-300 flex items-center justify-center ${
                        selectedSizes.includes(size.id) ? "w-6" : "w-0"
                      }`}
                    >
                      <div
                        className={`h-1.5 w-1.5 rounded-full bg-black transition-opacity duration-300 ${
                          selectedSizes.includes(size.id)
                            ? "opacity-100"
                            : "opacity-0"
                        }`}
                      ></div>
                    </div>
                    <span className="ml-2">{size.name}</span>
                  </div>
                ))}
              </div>
            }
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <button
            onClick={handleApply}
            className="w-full py-3 bg-[#1c1c1c] text-[#f5f5f5]"
          >
            Anvend
          </button>
        </div>
      </div>
    </>
  );
};

export default FilterMenu;
