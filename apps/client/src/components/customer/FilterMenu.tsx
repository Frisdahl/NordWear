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
      {/* Separate Backdrop - Matching Mobile Menu & Cart */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        style={{ zIndex: 9998 }}
        onClick={onClose}
      />

      {/* Filter Drawer - Matching Mobile Menu & Cart Animation */}
      <div
        className={`fixed top-0 right-0 h-full bg-[#f2f1f0] w-[85vw] md:w-[35vw] lg:w-[25vw] min-w-[320px] max-w-[500px] shadow-xl transform transition-transform duration-500 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ zIndex: 9999 }}
      >
        <div className="p-6 flex justify-end items-center pb-4">
          <button onClick={onClose}>
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            <Accordion
              title="Pris"
              content={
                <div className="pt-8 px-4 pb-4">
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
                </div>
              }
            />
            <Accordion
              title="Produkttype"
              content={
                <div className="pt-4 pb-4 space-y-3">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center cursor-pointer group"
                      onClick={() => handleCategoryChange(category.id)}
                    >
                      <div
                        className={`h-4 w-4 border border-[#1c1c1c] rounded-sm flex items-center justify-center transition-colors ${
                          selectedCategories.includes(category.id) ? "bg-[#1c1c1c]" : "bg-transparent"
                        }`}
                      >
                        {selectedCategories.includes(category.id) && (
                          <div className="h-1.5 w-1.5 bg-white rounded-full"></div>
                        )}
                      </div>
                      <span className="ml-3 text-sm">{category.name}</span>
                    </div>
                  ))}
                </div>
              }
            />
            <Accordion
              title="Størrelse"
              content={
                <div className="pt-4 pb-4 space-y-3">
                  {sizes.map((size) => (
                    <div
                      key={size.id}
                      className="flex items-center cursor-pointer group"
                      onClick={() => handleSizeChange(size.id)}
                    >
                      <div
                        className={`h-4 w-4 border border-[#1c1c1c] rounded-sm flex items-center justify-center transition-colors ${
                          selectedSizes.includes(size.id) ? "bg-[#1c1c1c]" : "bg-transparent"
                        }`}
                      >
                        {selectedSizes.includes(size.id) && (
                          <div className="h-1.5 w-1.5 bg-white rounded-full"></div>
                        )}
                      </div>
                      <span className="ml-3 text-sm">{size.name}</span>
                    </div>
                  ))}
                </div>
              }
            />
          </div>
        </div>

        <div className="p-6 border-t border-[#00000026] bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
          <button
            onClick={handleApply}
            className="w-full py-3 bg-[#1c1c1c] text-white rounded-md font-medium transition-opacity hover:opacity-90"
          >
            Anvend
          </button>
        </div>
      </div>
    </>
  );
};

export default FilterMenu;