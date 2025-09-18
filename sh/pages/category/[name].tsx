// pages/category/[name].tsx
import { GetServerSideProps, NextPage } from 'next';
import { IProduct } from '../../types';
import ProductCard from '../../components/ProductCard';
import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';

interface CategoryPageProps {
  products: IProduct[];
  category: string;
  total: number;
  page: number;
  pageSize: number;
  error?: string;
}

const PAGE_SIZE = 9;

const CategoryPage: NextPage<CategoryPageProps> = ({
  products,
  category,
  total,
  page,
  pageSize,
  error,
}) => {
  const totalPages = Math.ceil(total / pageSize);
  const [currentPage, setCurrentPage] = useState(page);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>(products);

  // Update filtered products whenever search term changes
  useEffect(() => {
    const filtered = products.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const maxPagesToShow = 3;

  const renderPageNumbers = () => {
    const pages = [];
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  if (error) {
    return (
      <div className="text-center text-red-500 mt-10 text-xl font-bold">
        {error}
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>
          {category.charAt(0).toUpperCase() + category.slice(1)} | My Clothing
          Store
        </title>
      </Head>
      <div className="container mx-auto p-8">
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/explore"
            className="flex items-center gap-2 bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-full shadow-md hover:bg-gray-300 transition-colors duration-200"
          >
            <ArrowLeft size={18} />
          
          </Link>
          <h1 className="text-3xl font-bold text-center flex-grow">
            {category.toUpperCase()}
          </h1>
          <div className="w-48"></div>
        </div>

        {/* Search Input */}
        <div className="flex justify-center mb-6">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64 max-w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
          />
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            No products found for "{searchTerm}"
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {filteredProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 gap-3 items-center">
            <Link
              href={`/category/${category}?page=${Math.max(1, currentPage - 1)}`}
              className={`px-3 py-2 rounded flex items-center justify-center ${
                currentPage === 1
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              <ChevronLeft size={20} />
            </Link>

            {renderPageNumbers().map((pageNumber) => (
              <Link
                key={pageNumber}
                href={`/category/${category}?page=${pageNumber}`}
                className={`px-4 py-2 rounded ${
                  currentPage === pageNumber
                    ? 'bg-gray-800 text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                {pageNumber}
              </Link>
            ))}

            <Link
              href={`/category/${category}?page=${Math.min(
                totalPages,
                currentPage + 1
              )}`}
              className={`px-3 py-2 rounded flex items-center justify-center ${
                currentPage === totalPages
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              <ChevronRight size={20} />
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { name } = context.query;
  const categoryName = typeof name === 'string' ? name : 'unknown';
  const page = parseInt((context.query.page as string) || '1');

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/products?category=${categoryName}&page=${page}&limit=${PAGE_SIZE}`
    );
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(
        `API Error: ${res.status} - ${errorData.message || 'Failed to fetch data'}`
      );
    }
    const json = await res.json();

    const products: IProduct[] = json.data.map((product: any) => ({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      description: product.description,
    }));

    return {
      props: {
        products,
        total: json.total || 0,
        page,
        pageSize: PAGE_SIZE,
        category: categoryName,
      },
    };
  } catch (err: any) {
    console.error('API Fetch Error:', err.message);
    return {
      props: {
        products: [],
        total: 0,
        page,
        pageSize: PAGE_SIZE,
        category: categoryName,
        error: `Could not load category: ${categoryName}. ${err.message}`,
      },
    };
  }
};

export default CategoryPage;
