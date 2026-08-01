"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/axios";
import { getGearImage } from '@/lib/getImage';

interface ICategory {
  id?: string;
  name?: string;
  slug?: string;
}

interface IGear {
  id: string;
  title: string;
  description: string;
  brand: string;
  pricePerDay: number;
  isAvailable: boolean;
  images?: string[];
  category?: ICategory | string;
}

const GearListPage = () => {
  const [gears, setGears] = useState<IGear[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchGears = async () => {
      setLoading(true);
      setErrorMessage("");
      try {
        const res = await api.get("/api/gear");
        const list = res.data?.data || res.data;

        if (Array.isArray(list)) {
          setGears(list);
        } else {
          setErrorMessage("Backend response pattern mismatch");
        }
      } catch (err: any) {
        console.error("API Error:", err);
        setErrorMessage(
          err.response?.data?.message || err.message || "Failed to connect",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchGears();
  }, []);

  return (
    <div className="bg-gray-900 h-160">
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6 mt-20">Available Gear List</h1>

        {errorMessage && (
          <div className="p-4 mb-4 bg-red-100 text-red-700 rounded border border-red-200 text-sm">
            <strong>Error:</strong> {errorMessage}
          </div>
        )}

        {loading ? (
          <p className="py-10 text-center text-gray-500">
            Loading items from server...
          </p>
        ) : gears.length === 0 ? (
          <p className="py-10 text-center text-gray-500">No items available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {gears.map((item) => {
              const categoryName =
                typeof item.category === "object"
                  ? item.category?.name
                  : item.category;

              return (
                <div
                  key={item.id}
                  className="border rounded-lg p-4 bg-white shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <img
                      src={getGearImage(item)}
                      alt={item.title}
                      className="w-full h-40 object-cover rounded mb-3"
                    />
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded font-medium">
                      {categoryName || "General"}
                    </span>
                    <h3 className="font-bold text-black text-lg mt-2">{item.title}</h3>
                    <p className="text-sm text-gray-500">{item.brand}</p>
                    <p className="text-blue-600 font-bold mt-2">
                      ৳{item.pricePerDay} / day
                    </p>
                  </div>

                  <Link
                    href={`/gear/${item.id}`}
                    className="mt-4 block text-center bg-blue-600 text-white py-2 rounded text-sm font-semibold hover:bg-blue-700"
                  >
                    View Details & Rent
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default GearListPage;
