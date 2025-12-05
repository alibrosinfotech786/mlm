"use client";

import React, { useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import axiosInstance from "@/app/api/axiosInstance";
import ProjectApiList from "@/app/api/ProjectApiList";
import Image from "next/image";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_IMAGE || "";

  // MODALS
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // FETCH PRODUCTS
  async function fetchProducts() {
    try {
      setLoading(true);
      const res = await axiosInstance.get(ProjectApiList.productsList);
      setProducts(res.data.products || []);
    } catch {
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  function buildImageUrl(path?: string) {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    return `${BASE_URL}/${path}`.replace(/([^:]\/)\/+/g, "$1");
  }

  /* ---------------------------------------------------
      CREATE PRODUCT
  --------------------------------------------------- */

  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    reset: resetCreate,
    watch: watchCreate,
    formState: { errors: createErrors },
  } = useForm<any>();

  const [createPreview, setCreatePreview] = useState<string | null>(null);

  useEffect(() => {
    const file = watchCreate("image")?.[0];
    if (file) setCreatePreview(URL.createObjectURL(file));
  }, [watchCreate("image")]);

  async function createProduct(data: any) {
    try {
      setLoading(true);

      const fd = new FormData();
      fd.append("name", data.name);
      fd.append("category", data.category); // NEW FIELD
      fd.append("mrp", data.mrp);
      fd.append("bv", data.bv);
      fd.append("stock", data.stock);
      fd.append("description", data.description || "");
      fd.append("ingredients", data.ingredients || "");
      fd.append("benefits", data.benefits || "");

      if (data.image?.[0]) fd.append("image", data.image[0]);

      await axiosInstance.post(ProjectApiList.createProduct, fd);

      toast.success("Product created!");
      resetCreate();
      setCreatePreview(null);
      setOpenCreateModal(false);
      fetchProducts();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  }

  /* ---------------------------------------------------
      EDIT PRODUCT
  --------------------------------------------------- */

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    watch: watchEdit,
    formState: { errors: editErrors },
  } = useForm<any>({ shouldUnregister: false });

  const [editPreview, setEditPreview] = useState<string | null>(null);

  useEffect(() => {
    const file = watchEdit("image")?.[0];
    if (file) setEditPreview(URL.createObjectURL(file));
  }, [watchEdit("image")]);

  function openEdit(p: any) {
    setSelectedProduct(p);
    resetEdit({
      name: p.name,
      category: p.category, // NEW FIELD
      mrp: p.mrp,
      bv: p.bv,
      stock: p.stock ? "1" : "0",
      description: p.description,
      ingredients: p.ingredients,
      benefits: p.benefits,
      image: null,
    });
    setEditPreview(buildImageUrl(p.image));
    setOpenEditModal(true);
  }

  async function updateProduct(data: any) {
    try {
      setLoading(true);

      const fd = new FormData();
      fd.append("id", String(selectedProduct.id));
      fd.append("name", data.name);
      fd.append("category", data.category); // NEW FIELD
      fd.append("mrp", data.mrp);
      fd.append("bv", data.bv);
      fd.append("stock", data.stock);
      fd.append("description", data.description || "");
      fd.append("ingredients", data.ingredients || "");
      fd.append("benefits", data.benefits || "");

      if (data.image?.[0]) fd.append("image", data.image[0]);

      await axiosInstance.post(ProjectApiList.updateProduct, fd);

      toast.success("Product updated!");
      setOpenEditModal(false);
      setEditPreview(null);
      setSelectedProduct(null);
      fetchProducts();
    } catch {
      toast.error("Failed to update product");
    } finally {
      setLoading(false);
    }
  }

  /* ---------------------------------------------------
      DELETE PRODUCT
  --------------------------------------------------- */

  async function deleteProduct() {
    try {
      setLoading(true);
      await axiosInstance.post(ProjectApiList.deleteProduct, {
        id: selectedProduct.id,
      });
      toast.success("Product deleted!");
      setOpenDeleteModal(false);
      setSelectedProduct(null);
      fetchProducts();
    } catch {
      toast.error("Failed to delete product");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* <AdminHeader /> */}

      <section className="min-h-screen bg-green-50/40 py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* HEADER */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-green-800">Products</h1>
              <p className="text-green-700 text-sm">Manage all products in a single place</p>
            </div>

            {/* CREATE TRIGGER */}
            <Dialog open={openCreateModal} onOpenChange={setOpenCreateModal}>
              <DialogTrigger asChild>
              </DialogTrigger>

             {/* CREATE MODAL */}
<Dialog open={openCreateModal} onOpenChange={setOpenCreateModal}>
  <DialogTrigger asChild>
    <Button className="bg-green-700 text-white">+ Add Product</Button>
  </DialogTrigger>

  <DialogContent className="sm:max-w-5xl px-6 py-6">
    <DialogHeader>
      <DialogTitle className="text-xl">Add New Product</DialogTitle>
    </DialogHeader>

    <form onSubmit={handleSubmitCreate(createProduct)} className="mt-4">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* LEFT FORM FIELDS */}
        <div className="md:col-span-2 space-y-6">

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <InputCreate label="Name" name="name" required register={registerCreate} errors={createErrors} />

            <div>
              <label className="text-sm font-medium text-gray-700">Category</label>
              <select
                {...registerCreate("category", { required: true })}
                className="border w-full px-3 py-2 rounded-md text-sm"
              >
                <option value="">Select</option>
                <option value="Personal Care">Personal Care</option>
                <option value="Health Care">Health Care</option>
              </select>
              {createErrors?.category && (
                <p className="text-xs text-red-500">Required</p>
              )}
            </div>

            <InputCreate label="MRP (₹)" name="mrp" type="number" required register={registerCreate} errors={createErrors} />
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <InputCreate label="BV" name="bv" type="number" required register={registerCreate} errors={createErrors} />

            <div>
              <label className="text-sm font-medium text-gray-700">Stock</label>
              <select {...registerCreate("stock")} className="border w-full px-3 py-2 rounded-md text-sm">
                <option value="true">In Stock</option>
                <option value="false">Out of Stock</option>
              </select>
            </div>

            <InputCreate label="Ingredients" name="ingredients" register={registerCreate} />
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <InputCreate label="Benefits" name="benefits" register={registerCreate} />

            <div className="col-span-2">
              <label className="text-sm font-medium">Description</label>
              <textarea
                {...registerCreate("description")}
                className="border w-full rounded-md px-3 py-2 text-sm h-20"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="text-sm font-medium">Upload Image</label>
            <input type="file" accept="image/*" {...registerCreate("image")} />
          </div>
        </div>

        {/* RIGHT PREVIEW */}
        <div className="flex flex-col items-center">
          <p className="text-sm mb-2">Preview</p>

          {createPreview ? (
            <Image
              src={createPreview}
              width={150}
              height={150}
              alt="preview"
              className="border rounded-md object-contain"
              unoptimized
            />
          ) : (
            <div className="w-[150px] h-[150px] bg-gray-100 border rounded-md flex items-center justify-center text-xs text-gray-500">
              No Image
            </div>
          )}
        </div>

      </div>

      <DialogFooter className="mt-6">
        <Button type="submit">{loading ? "Saving..." : "Create"}</Button>
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
      </DialogFooter>

    </form>

  </DialogContent>
</Dialog>

            </Dialog>
          </div>

          {/* TABLE */}
          <div className="bg-white rounded-xl shadow-md border border-green-100 overflow-hidden">

  {/* TABLE WRAPPER */}
  <div className="overflow-x-auto">
    <table className="min-w-full text-sm">
      
      {/* HEADER */}
      <thead className="bg-green-600 text-white uppercase text-xs tracking-wide sticky top-0 z-10">
        <tr>
          <th className="px-4 py-3 border-r">Image</th>
          <th className="px-4 py-3 border-r">Name</th>
          <th className="px-4 py-3 border-r">Category</th>
          <th className="px-4 py-3 border-r">MRP</th>
          <th className="px-4 py-3 border-r">BV</th>
          <th className="px-4 py-3 border-r">Stock</th>
          <th className="px-4 py-3 border-r">Description</th>
          <th className="px-4 py-3">Actions</th>
        </tr>
      </thead>

      {/* BODY */}
      <tbody>
        {loading ? (
          <tr>
            <td colSpan={8} className="py-6 text-center text-gray-500">
              Loading products...
            </td>
          </tr>
        ) : products.length === 0 ? (
          <tr>
            <td colSpan={8} className="py-6 text-center text-gray-500">
              No products found
            </td>
          </tr>
        ) : (
          products.map((p) => (
            <tr key={p.id} className="border-b hover:bg-green-50">

              {/* IMAGE */}
              <td className="px-4 py-3 border-r text-center">
                {p.image ? (
                  <Image
                    src={buildImageUrl(p.image) ?? "/no-img.png"}
                    width={50}
                    height={50}
                    alt="product"
                    className="rounded border object-contain mx-auto"
                    unoptimized
                  />
                ) : (
                  <span className="text-xs text-gray-400">No Image</span>
                )}
              </td>

              {/* NAME */}
              <td className="px-4 py-3 border-r font-medium">
                <span className="line-clamp-1">{p.name}</span>
              </td>

              {/* CATEGORY */}
              <td className="px-4 py-3 border-r">{p.category}</td>

              {/* PRICE */}
              <td className="px-4 py-3 border-r font-semibold">₹{p.mrp}</td>

              {/* BV */}
              <td className="px-4 py-3 border-r">{p.bv}</td>

              {/* STOCK */}
              <td className="px-4 py-3 border-r">
                {p.stock ? (
                  <span className="text-green-700 font-semibold">In Stock</span>
                ) : (
                  <span className="text-red-600 font-semibold">Out of Stock</span>
                )}
              </td>

              {/* DESCRIPTION */}
              <td className="px-4 py-3 border-r max-w-[180px]">
                <span className="line-clamp-2 text-gray-700">{p.description}</span>
              </td>

              {/* ACTIONS */}
              <td className="px-4 py-3">
                <div className="flex flex-col gap-1 text-sm">
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => openEdit(p)}
                  >
                    Edit
                  </button>

                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => {
                      setSelectedProduct(p);
                      setOpenDeleteModal(true);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </td>

            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>

</div>

        </div>
      </section>

     {/* EDIT MODAL */}
<Dialog open={openEditModal} onOpenChange={setOpenEditModal}>
  <DialogContent className="sm:max-w-5xl px-6 py-6">
    <DialogHeader>
      <DialogTitle className="text-xl">Edit Product</DialogTitle>
    </DialogHeader>

    <form onSubmit={handleSubmitEdit(updateProduct)} className="mt-4">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* LEFT FIELDS */}
        <div className="md:col-span-2 space-y-6">

          {/* Row 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <InputEdit label="Name" name="name" required register={registerEdit} errors={editErrors} />

            <div>
              <label className="text-sm font-medium">Category</label>
              <select
                {...registerEdit("category", { required: true })}
                className="border w-full px-3 py-2 rounded-md text-sm"
              >
                <option value="">Select</option>
                <option value="Personal Care">Personal Care</option>
                <option value="Health Care">Health Care</option>
              </select>
              {editErrors?.category && (
                <p className="text-xs text-red-500">Required</p>
              )}
            </div>

            <InputEdit label="MRP (₹)" name="mrp" type="number" required register={registerEdit} errors={editErrors} />
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <InputEdit label="BV" name="bv" type="number" required register={registerEdit} errors={editErrors} />

            <div>
              <label className="text-sm font-medium">Stock</label>
              <select {...registerEdit("stock")} className="border w-full px-3 py-2 rounded-md text-sm">
                <option value="1">In Stock</option>
                <option value="0">Out of Stock</option>
              </select>
            </div>

            <InputEdit label="Ingredients" name="ingredients" register={registerEdit} />
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <InputEdit label="Benefits" name="benefits" register={registerEdit} />

            <div className="col-span-2">
              <label className="text-sm font-medium">Description</label>
              <textarea
                {...registerEdit("description")}
                className="border w-full rounded-md px-3 py-2 text-sm h-20"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="text-sm font-medium">Upload New Image</label>
            <input type="file" accept="image/*" {...registerEdit("image")} />
          </div>
        </div>

        {/* RIGHT PREVIEW */}
        <div className="flex flex-col items-center">
          <p className="text-sm mb-2">Preview</p>
          {editPreview ? (
            <Image
              src={editPreview}
              width={150}
              height={150}
              alt="preview"
              className="border rounded-md object-contain"
              unoptimized
            />
          ) : (
            <div className="w-[150px] h-[150px] bg-gray-100 border rounded-md flex items-center justify-center text-xs text-gray-500">
              No Image
            </div>
          )}
        </div>

      </div>

      <DialogFooter className="mt-6">
        <Button type="submit">{loading ? "Updating..." : "Update"}</Button>
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
      </DialogFooter>

    </form>

  </DialogContent>
</Dialog>


      {/* DELETE MODAL */}
      <Dialog open={openDeleteModal} onOpenChange={setOpenDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
          </DialogHeader>

          <p className="text-gray-700">
            Are you sure you want to delete{" "}
            <span className="font-semibold">{selectedProduct?.name}</span>?
          </p>

          <DialogFooter className="mt-4">
            <Button className="bg-red-600 text-white" onClick={deleteProduct}>
              Delete
            </Button>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

/* ---------------------------------------------------
    INPUT COMPONENTS
--------------------------------------------------- */

function TwoColInputCreate({ register, errors }: any) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <InputCreate label="Name" name="name" required register={register} errors={errors} />

      {/* CATEGORY DROPDOWN */}
      <div>
        <label className="text-sm font-medium text-gray-700">Category</label>
        <select
          {...register("category", { required: true })}
          className="border w-full px-3 py-2 rounded-md text-sm"
        >
          <option value="">Select Category</option>
          <option value="Personal Care">Personal Care</option>
          <option value="Health Care">Health Care</option>
        </select>

        {errors?.category && (
          <p className="text-xs text-red-500">Category is required</p>
        )}
      </div>

      <InputCreate label="MRP (₹)" name="mrp" type="number" required register={register} errors={errors} />
      <InputCreate label="BV" name="bv" type="number" required register={register} errors={errors} />

      {/* STOCK */}
      <div>
        <label className="text-sm font-medium text-gray-700">Stock</label>
        <select {...register("stock")} className="border w-full px-3 py-2 rounded-md text-sm">
          <option value="true">In Stock</option>
          <option value="false">Out of Stock</option>
        </select>
      </div>

      <InputCreate label="Ingredients" name="ingredients" register={register} />
      <InputCreate label="Benefits" name="benefits" register={register} />
    </div>
  );
}


function TwoColInputEdit({ register, errors }: any) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <InputEdit label="Name" name="name" required register={register} errors={errors} />

      {/* CATEGORY DROPDOWN */}
      <div>
        <label className="text-sm font-medium text-gray-700">Category</label>
        <select
          {...register("category", { required: true })}
          className="border w-full px-3 py-2 rounded-md text-sm"
        >
          <option value="">Select Category</option>
          <option value="Personal Care">Personal Care</option>
          <option value="Health Care">Health Care</option>
        </select>

        {errors?.category && (
          <p className="text-xs text-red-500">Category is required</p>
        )}
      </div>

      <InputEdit label="MRP (₹)" name="mrp" type="number" required register={register} errors={errors} />
      <InputEdit label="BV" name="bv" type="number" required register={register} errors={errors} />

      <div>
        <label className="text-sm font-medium text-gray-700">Stock</label>
        <select {...register("stock")} className="border w-full px-3 py-2 rounded-md text-sm">
          <option value="1">In Stock</option>
          <option value="0">Out of Stock</option>
        </select>
      </div>

      <InputEdit label="Ingredients" name="ingredients" register={register} />
      <InputEdit label="Benefits" name="benefits" register={register} />
    </div>
  );
}

function InputCreate({ label, name, type = "text", required, register, errors }: any) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input
        type={type}
        {...register(name, required ? { required: true } : {})}
        className="border w-full px-3 py-2 rounded-md text-sm"
      />
      {required && errors?.[name] && (
        <p className="text-xs text-red-500">{label} is required</p>
      )}
    </div>
  );
}

function InputEdit({ label, name, type = "text", required, register, errors }: any) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input
        type={type}
        {...register(name, required ? { required: true } : {})}
        className="border w-full px-3 py-2 rounded-md text-sm"
      />
      {required && errors?.[name] && (
        <p className="text-xs text-red-500">{label} is required</p>
      )}
    </div>
  );
}
