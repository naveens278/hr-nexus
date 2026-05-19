import React from "react";

/**
 * AnimatedList - List with smooth item animations
 */
const AnimatedList = ({
  items = [],
  renderItem,
  emptyMessage = "No items found",
  onItemClick,
  loading = false,
  SkeletonComponent
}) => {
  if (loading && SkeletonComponent) {
    return <SkeletonComponent />;
  }

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">😢 {emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((item, idx) => (
        <div
          key={item.id || idx}
          onClick={() => onItemClick?.(item)}
          style={{
            animation: `listItemSlideIn 0.4s ease-out ${idx * 0.05}s both`
          }}
          className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:bg-gray-50 hover:translate-x-1 cursor-pointer"
        >
          {renderItem ? renderItem(item, idx) : (
            <div>
              <p className="font-semibold text-gray-800">{item.name || item.title}</p>
              <p className="text-sm text-gray-600 mt-1">{item.description}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AnimatedList;
