import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X, User, Phone, IndianRupee } from 'lucide-react';
import { useKhataStore } from '../store/useKhataStore';

const customerSchema = z.object({
  name: z.string().trim().min(1, 'Customer name is mandatory').max(100, 'Name is too long'),
  phone: z.string().trim().optional().refine(val => {
    if (!val || val.length === 0) return true;
    return /^[0-9]{10}$/.test(val.replace(/\s+/g, ''));
  }, 'Phone number must be a valid 10-digit number'),
  rate_per_cup: z.number().gt(0, 'Rate must be greater than zero'),
});

type CustomerFormData = {
  name: string;
  phone?: string;
  rate_per_cup: number;
};

export const AddCustomerModal: React.FC = () => {
  const { isAddCustomerModalOpen, setIsAddCustomerModalOpen, createCustomer, isSubmitting } = useKhataStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema) as any,
    defaultValues: {
      name: '',
      phone: '',
      rate_per_cup: 10,
    }
  });

  if (!isAddCustomerModalOpen) return null;

  const onSubmit = async (data: CustomerFormData) => {
    const success = await createCustomer({
      name: data.name,
      phone: data.phone || undefined,
      rate_per_cup: Number(data.rate_per_cup)
    });
    if (success) {
      reset();
      setIsAddCustomerModalOpen(false);
    }
  };

  const handleClose = () => {
    reset();
    setIsAddCustomerModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm transition-all animate-fadeIn">
      <div 
        className="w-full max-w-md bg-[#FFF6EC] rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-[#F3DEC9] animate-slideUp sm:animate-scaleIn max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#F3DEC9]">
          <div>
            <h2 className="text-lg font-bold text-[#181818] tracking-tight">
              Add New Customer
            </h2>
            <p className="text-xs text-[#6B7280]">
              Create a new customer ledger khata
            </p>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-[#FBEBDD] text-[#6B7280] hover:text-[#181818] hover:bg-[#FFE7CC] flex items-center justify-center transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
          {/* Customer Name */}
          <div>
            <label className="block text-xs font-bold text-[#5B2D16] uppercase tracking-wider mb-1.5">
              Customer Name <span className="text-[#DC2626]">*</span>
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-[#C45A0A] pointer-events-none">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                {...register('name')}
                placeholder="e.g. Sumeet Kiran, Subhash Store"
                className={`w-full pl-10 pr-3.5 py-3 bg-[#FBEBDD] border rounded-2xl text-sm font-medium text-[#181818] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#C45A0A] ${
                  errors.name ? 'border-[#DC2626]' : 'border-[#F3DEC9]'
                }`}
              />
            </div>
            {errors.name && (
              <p className="text-xs text-[#DC2626] mt-1 font-medium">{errors.name.message}</p>
            )}
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-xs font-bold text-[#5B2D16] uppercase tracking-wider mb-1.5">
              Mobile Number <span className="text-xs font-normal text-[#6B7280]">(Optional)</span>
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-[#C45A0A] pointer-events-none">
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="tel"
                {...register('phone')}
                placeholder="e.g. 9876543210"
                className={`w-full pl-10 pr-3.5 py-3 bg-[#FBEBDD] border rounded-2xl text-sm font-medium text-[#181818] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#C45A0A] ${
                  errors.phone ? 'border-[#DC2626]' : 'border-[#F3DEC9]'
                }`}
              />
            </div>
            {errors.phone && (
              <p className="text-xs text-[#DC2626] mt-1 font-medium">{errors.phone.message}</p>
            )}
          </div>

          {/* Default Rate Per Cup */}
          <div>
            <label className="block text-xs font-bold text-[#5B2D16] uppercase tracking-wider mb-1.5">
              Default Rate Per Cup (₹) <span className="text-[#DC2626]">*</span>
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-[#C45A0A] pointer-events-none">
                <IndianRupee className="w-4 h-4" />
              </div>
              <input
                type="number"
                step="0.5"
                {...register('rate_per_cup', { valueAsNumber: true })}
                placeholder="10"
                className={`w-full pl-10 pr-3.5 py-3 bg-[#FBEBDD] border rounded-2xl text-sm font-medium text-[#181818] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#C45A0A] ${
                  errors.rate_per_cup ? 'border-[#DC2626]' : 'border-[#F3DEC9]'
                }`}
              />
            </div>
            {errors.rate_per_cup && (
              <p className="text-xs text-[#DC2626] mt-1 font-medium">{errors.rate_per_cup.message}</p>
            )}
          </div>

          {/* Actions */}
          <div className="pt-3 flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-3 px-4 rounded-2xl bg-[#FBEBDD] hover:bg-[#FFE7CC] text-[#5B2D16] text-sm font-bold transition-all border border-[#F3DEC9]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 px-4 rounded-2xl bg-[#5B2D16] hover:bg-[#321707] text-[#FFF6EC] text-sm font-bold transition-all shadow-cafe-md active:scale-[0.98] disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Customer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
