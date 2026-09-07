import React, { useState } from 'react';

export function ApparelGridCard({ product, onAddSelection }) {
  const [activeSize, setActiveSize] = useState('M');
  const sizeSyllabus = ['S', 'M', 'L', 'XL'];

  return (
    <div className="bg-white border border-zinc-200/50 rounded-2xl p-5 shadow-sm flex flex-col justify-between group hover:shadow-md transition-all duration-300">
      <div className="w-full h-64 bg-zinc-50 rounded-xl p-6 flex items-center justify-center overflow-hidden mb-4 relative">
        <span className="absolute top-3 left-3 text-[10px] bg-zinc-900 text-white font-bold px-2.5 py-0.5 rounded-full tracking-wider uppercase">
          {product.genderCategory}
        </span>
        <img 
          src={product.image} 
          alt={product.title} 
          className="max-h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500 ease-out" 
        />
      </div>
      
      <div>
        <h3 className="font-semibold text-zinc-900 text-base line-clamp-1">{product.displayName}</h3>
        <p className="text-sm font-bold text-zinc-500 mt-0.5">${product.price.toFixed(2)}</p>
        
        {/* HORIZONTAL SIZE SELECT VARIATION INTERFACE */}
        <div className="my-4">
          <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-1.5">Select Size</label>
          <div className="flex gap-2">
            {sizeSyllabus.map(size => (
              <button
                key={size}
                type="button"
                onClick={() => setActiveSize(size)}
                className={`text-xs w-8 h-8 rounded-lg border font-bold transition-all ${activeSize === size ? 'bg-zinc-900 border-zinc-900 text-white shadow-sm' : 'border-zinc-200 text-zinc-500 hover:border-zinc-400 bg-white'}`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button 
        onClick={() => onAddSelection(product, activeSize)}
        className="w-full bg-[#1A1A1A] hover:bg-zinc-800 text-white text-xs font-bold py-3 rounded-xl transition-colors tracking-wide mt-2"
      >
        Add to Selection Bag
      </button>
    </div>
  );
}

export function PipelineBadge({ pipelineStatus }) {
  const systemThemes = {
    'Pending Approval': 'bg-amber-50 text-amber-700 border border-amber-200',
    'Processing': 'bg-blue-50 text-blue-700 border border-blue-200',
    'Out for Delivery': 'bg-purple-50 text-purple-700 border border-purple-200',
    'Delivered': 'bg-emerald-50 text-emerald-700 border border-emerald-200'
  };

  return (
    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap ${systemThemes[pipelineStatus]}`}>
      {pipelineStatus}
    </span>
  );
}
