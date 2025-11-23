// ProductDetail.jsx - Tối ưu hóa sau khi sửa BE
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { addToCart } from "../../utils/cartService";
import { Gift, ShoppingCart, Sparkles, MessageCircle, Send, Edit2, Trash2, Check, X, Ruler, Palette, HardDrive, BatteryCharging } from "lucide-react";

function formatDate(dateString) {
  if (!dateString) return "";
  const d = new Date(dateString);
  return d.toLocaleString("en-US", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  // Không cần state phức tạp, sẽ lấy tên trực tiếp từ data
  const [categoryName, setCategoryName] = useState("N/A"); 
  const [brandName, setBrandName] = useState("N/A");
  const [loading, setLoading] = useState(true);

  // --- COMMENT STATE ---
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingContent, setEditingContent] = useState("");
  const [commentError, setCommentError] = useState(null);

  const [productDetails, setProductDetails] = useState({
    size: null,
    color: null,
    capacity: null,
    batteryCapacity: null,
  });
  
  const [selectedDetail, setSelectedDetail] = useState({
    size: "",
    color: "",
    capacity: "",
    batteryCapacity: "",
  });

  // ================= FETCH LOGIC =================

  useEffect(() => {
    fetchProduct();
    fetchComments();
  }, [id]);

  // Loại bỏ hàm fetchCategoryAndBrand không cần thiết nữa

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const res = await fetch(`https://localhost:7165/api/products/${id}`);
      if (!res.ok) throw new Error("Failed to fetch product");
      const data = await res.json();
      setProduct(data);

      if (data.detail) {
        setProductDetails({
            size: data.detail.size || null,
            color: data.detail.color || null,
            capacity: data.detail.capacity || null,
            batteryCapacity: data.detail.batteryCapacity || null,
        });

        setSelectedDetail({
          size: data.detail.size || "",
          color: data.detail.color || "",
          capacity: data.detail.capacity || "",
          batteryCapacity: data.detail.batteryCapacity || "",
        });
      } else {
        setProductDetails({});
      }

      // 🛑 LOGIC MỚI: Chỉ cần đọc trực tiếp (An toàn hơn)
      // data.category và data.brand đã là đối tượng nhờ sửa BE
      const catName = data.category?.name || "N/A";
      setCategoryName(catName);

      const bName = data.brand?.name || "N/A";
      setBrandName(bName);
      
    } catch (error) {
      console.error("Lỗi khi tải sản phẩm:", error);
      setCategoryName("N/A (Lỗi tải)");
      setBrandName("N/A (Lỗi tải)");
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await fetch(`https://localhost:7165/api/ProductComment/${id}`);
      if (!res.ok) throw new Error("Failed to fetch comments");
      const data = await res.json();
      setComments(data);
    } catch (error) {
      console.error(error);
    }
  };

  // ================= COMMENT & CART ACTIONS (Giữ nguyên) =================
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment? 🎄")) return;
    try {
      const token = localStorage.getItem("accessToken"); 
      const res = await fetch(`https://localhost:7165/api/ProductComment/${commentId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete comment");
      await fetchComments();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEditComment = (comment) => {
    setEditingId(comment.id);
    setEditingContent(comment.content);
  };

  const handleUpdateComment = async () => {
    if (!editingContent.trim()) {
      alert("Comment content cannot be empty");
      return;
    }
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`https://localhost:7165/api/ProductComment/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: editingContent }),
      });
      if (!res.ok) throw new Error("Failed to update comment");
      setEditingId(null);
      setEditingContent("");
      await fetchComments();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) {
      setCommentError("Please enter your comment!");
      return;
    }

    try {
      setCommentLoading(true);
      setCommentError(null);

      const token = localStorage.getItem("accessToken");

      const res = await fetch("https://localhost:7165/api/ProductComment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: id,
          content: newComment,
        }),
      });

      if (!res.ok) throw new Error("Failed to submit comment!");

      setNewComment("");
      await fetchComments();
    } catch (error) {
      setCommentError(error.message);
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDetailChange = (field, value) => {
    setSelectedDetail((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddToCart = (goToCart = false) => {
    const finalPrice =
        product.salePercent && product.salePercent > 0
        ? product.price * (1 - product.salePercent / 100)
        : product.price;

    const productToAdd = {
      id: product.id,
      name: product.name,
      price: finalPrice, 
      image: product.imageUrl,
      ...selectedDetail,
    };

    addToCart(productToAdd, 1);

    if (goToCart) navigate("/cart");
    else alert("🎄 Product added to cart!");
  };

  if (loading) return <p className="text-center mt-10 text-red-600">Loading...</p>;
  if (!product) return <p className="text-center text-red-500 mt-10">Product not found</p>;

  const finalPrice =
    product.salePercent && product.salePercent > 0
      ? product.price * (1 - product.salePercent / 100)
      : product.price;


  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 via-white to-green-50">
      <div className="bg-gradient-to-r from-red-600 via-green-600 to-red-600 h-2"></div>
      
      <div className="max-w-6xl mx-auto p-6">
        <Link to="/" className="inline-flex items-center gap-2 text-red-600 hover:text-green-600 mb-6 font-semibold transition-colors">
          <span>←</span> Back to Home
        </Link>

        {/* Main Product Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-4 border-red-200">
          <div className="bg-gradient-to-r from-red-600 to-green-600 h-1"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <div className="relative group">
              <div className="absolute -top-4 -right-4 bg-red-600 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg z-10 rotate-12">
                🎅 Special Offer
              </div>
              <div className="relative overflow-hidden rounded-xl shadow-xl border-4 border-green-200">
                <img
                  src={product.imageUrl || ""}
                  alt={product.name}
                  className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-red-900/20 to-transparent pointer-events-none"></div>
              </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="text-yellow-500" size={24} />
                <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-green-600 bg-clip-text text-transparent">
                  {product.name}
                </h1>
              </div>

              {/* Price Display */}
              <div className="text-4xl font-extrabold mb-4">
                {product.salePercent > 0 ? (
                  <div className="flex items-baseline gap-3">
                    <span className="text-red-600">
                      {finalPrice.toLocaleString()} đ
                    </span>
                    <span className="line-through text-gray-400 text-xl font-normal">
                      {product.price.toLocaleString()} đ
                    </span>
                    <span className="bg-red-500 text-white text-sm px-3 py-1 rounded-full font-semibold shadow-md">
                      -{product.salePercent}%
                    </span>
                  </div>
                ) : (
                  <span className="text-red-600">
                    {product.price.toLocaleString()} đ
                  </span>
                )}
              </div>

              <p className="text-gray-700 mb-6 leading-relaxed">{product.description}</p>

              {/* Product Details (Category, Brand, Stock + New Details) */}
              <div className="bg-gradient-to-br from-red-50 to-green-50 rounded-xl p-6 mb-6 border-2 border-red-200">
                <div className="grid grid-cols-2 gap-4">
                  
                  {/* Category */}
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🏷️</span>
                    <div>
                      <p className="text-xs text-gray-500">Category</p>
                      <p className="font-semibold text-gray-800">{categoryName}</p> 
                    </div>
                  </div>
                  
                  {/* Brand */}
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">⭐</span>
                    <div>
                      <p className="text-xs text-gray-500">Brand</p>
                      <p className="font-semibold text-gray-800">{brandName}</p>
                    </div>
                  </div>
                  
                  {/* Stock */}
                  <div className="flex items-center gap-2 col-span-2">
                    <span className="text-2xl">📦</span>
                    <div>
                      <p className="text-xs text-gray-500">Stock</p>
                      <p className="font-semibold text-gray-800">{product.stock}</p>
                    </div>
                  </div>
                  
                  {/* === DEVICE DETAILS SECTION === */}
                  
                  {productDetails.size && (
                      <div className="flex items-center gap-2">
                        <Ruler className="text-red-500" size={24} />
                        <div>
                          <p className="text-xs text-gray-500">Size</p>
                          <p className="font-semibold text-gray-800">{productDetails.size}</p>
                        </div>
                      </div>
                  )}

                  {productDetails.color && (
                      <div className="flex items-center gap-2">
                        <Palette className="text-green-500" size={24} />
                        <div>
                          <p className="text-xs text-gray-500">Color</p>
                          <p className="font-semibold text-gray-800">{productDetails.color}</p>
                        </div>
                      </div>
                  )}

                  {(productDetails.capacity > 0 || productDetails.capacity === 'string') && (
                      <div className="flex items-center gap-2">
                        <HardDrive className="text-blue-500" size={24} />
                        <div>
                          <p className="text-xs text-gray-500">Capacity</p>
                          <p className="font-semibold text-gray-800">{productDetails.capacity}</p>
                        </div>
                      </div>
                  )}

                  {(productDetails.batteryCapacity > 0 || productDetails.batteryCapacity === 'string') && (
                      <div className="flex items-center gap-2">
                        <BatteryCharging className="text-yellow-500" size={24} />
                        <div>
                          <p className="text-xs text-gray-500">Battery Capacity</p>
                          <p className="font-semibold text-gray-800">{productDetails.batteryCapacity}</p>
                        </div>
                      </div>
                  )}
                  {/* === END DEVICE DETAILS SECTION === */}

                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-auto flex gap-4">
                <button
                  className="flex-1 bg-white border-3 border-red-600 text-red-600 px-8 py-4 rounded-full font-bold hover:bg-red-50 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                  onClick={() => handleAddToCart(false)}
                >
                  <ShoppingCart size={20} />
                  Add To Cart
                </button>

                <button
                  onClick={() => handleAddToCart(true)}
                  className="flex-1 bg-gradient-to-r from-red-600 to-green-600 text-white px-8 py-4 rounded-full font-bold hover:from-red-700 hover:to-green-700 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                >
                  <Gift size={20} />
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-10 bg-white rounded-2xl shadow-2xl p-8 border-4 border-green-200">
          <div className="flex items-center gap-3 mb-6">
            <MessageCircle className="text-green-600" size={28} />
            <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-red-600 bg-clip-text text-transparent">
              Customer Reviews
            </h2>
            <span className="text-2xl">🎄</span>
          </div>

          {/* Comment Form */}
          <div className="mb-8 bg-gradient-to-br from-green-50 to-red-50 rounded-xl p-6 border-2 border-green-200">
            <textarea
              rows="4"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts about this product... 🎅"
              className="w-full border-2 border-green-300 p-4 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-300 focus:border-red-400 transition-all"
            />

            {commentError && (
              <p className="text-red-600 mt-3 flex items-center gap-2">
                <span>⚠️</span> {commentError}
              </p>
            )}

            <button
              onClick={handleSubmitComment}
              disabled={commentLoading}
              className="mt-4 bg-gradient-to-r from-green-600 to-red-600 text-white px-8 py-3 rounded-full font-bold hover:from-green-700 hover:to-red-700 transition-all transform hover:scale-105 shadow-lg flex items-center gap-2 disabled:opacity-50"
            >
              <Send size={18} />
              {commentLoading ? "Sending..." : "Post Comment"}
            </button>
          </div>

          {/* Comments List */}
          {comments.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">🎁 No reviews yet. Be the first to share!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((c) => (
                <div key={c.id} className="bg-gradient-to-r from-red-50 to-green-50 border-2 border-green-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center mb-4">
                    <div className="relative">
                      <img
                        src={c.user?.avatarUrl || "https://via.placeholder.com/40"}
                        alt={c.user?.name}
                        className="w-12 h-12 rounded-full border-3 border-red-400 shadow-md"
                      />
                      <span className="absolute -top-1 -right-1 text-xl">🎅</span>
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="font-bold text-gray-800">{c.user?.name}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <span>🕐</span>
                        {formatDate(c.createdDate || c.createAt)}
                      </p>
                    </div>
                  </div>

                  {editingId === c.id ? (
                    <div className="pl-16">
                      <textarea
                        className="w-full border-2 border-green-300 rounded-xl p-3 focus:outline-none focus:ring-4 focus:ring-red-300"
                        rows="3"
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                      />
                      <div className="mt-3 flex gap-3">
                        <button
                          onClick={handleUpdateComment}
                          className="px-5 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-full font-semibold hover:from-green-700 hover:to-green-800 transition-all flex items-center gap-2"
                        >
                          <Check size={16} />
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(null);
                            setEditingContent("");
                          }}
                          className="px-5 py-2 bg-gray-400 text-white rounded-full font-semibold hover:bg-gray-500 transition-all flex items-center gap-2"
                        >
                          <X size={16} />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-gray-700 leading-relaxed pl-16 mb-3">{c.content}</p>
                      
                      <div className="pl-16 flex gap-4">
                        <button
                          onClick={() => handleEditComment(c)}
                          className="text-green-600 hover:text-green-700 font-semibold flex items-center gap-1 transition-colors"
                        >
                          <Edit2 size={14} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteComment(c.id)}
                          className="text-red-600 hover:text-red-700 font-semibold flex items-center gap-1 transition-colors"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer decoration */}
      <div className="bg-gradient-to-r from-red-600 via-green-600 to-red-600 h-2 mt-10"></div>
    </div>
  );
}