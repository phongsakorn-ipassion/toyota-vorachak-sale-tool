import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import Icon from '../components/icons/Icon';

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [role, setRole] = useState('sales');

  const doLogin = () => {
    login(role);
    navigate(role === 'mgr' ? '/mgr-dash' : '/sales-dash');
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-6">
      <div className="w-[72px] h-[72px] rounded-full bg-primary flex items-center justify-center mb-3">
        <Icon name="car" size={32} className="text-white" />
      </div>
      <h1 className="text-[20px] font-extrabold text-t1 mb-1">Toyota Sale Tool</h1>
      <p className="text-[12px] text-t2 mb-7">วรจักร์ยนต์ . Digital Sales Platform</p>

      <div className="w-full max-w-[340px] space-y-3">
        <div>
          <label className="block text-[10px] font-extrabold text-t2 tracking-wider uppercase mb-[5px]">ชื่อผู้ใช้ / Username</label>
          <div className="relative">
            <span className="absolute left-[13px] top-1/2 -translate-y-1/2 text-t3"><Icon name="user" size={16} /></span>
            <input type="text" defaultValue="malee.sales" className="w-full py-3 pl-[38px] pr-3 bg-white border border-border rounded-md text-[13px] text-t1 outline-none focus:border-primary" style={{ fontFamily: "'Sarabun', sans-serif" }} />
          </div>
        </div>
        <div>
          <label className="block text-[10px] font-extrabold text-t2 tracking-wider uppercase mb-[5px]">รหัสผ่าน / Password</label>
          <div className="relative">
            <span className="absolute left-[13px] top-1/2 -translate-y-1/2 text-t3"><Icon name="lock" size={16} /></span>
            <input type="password" defaultValue="password" className="w-full py-3 pl-[38px] pr-3 bg-white border border-border rounded-md text-[13px] text-t1 outline-none focus:border-primary" style={{ fontFamily: "'Sarabun', sans-serif" }} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-[10px] pt-2 pb-3">
          <button onClick={() => setRole('sales')} className={`p-[14px] rounded-lg text-center border-[1.5px] transition-all cursor-pointer ${role === 'sales' ? 'border-primary bg-primary-light' : 'border-border bg-white'}`}>
            <div className="flex justify-center mb-1 text-primary"><Icon name="user" size={22} /></div>
            <div className="text-[12px] font-extrabold text-t1">Sales Staff</div>
            <div className="text-[10px] text-t2">พนักงานขาย</div>
          </button>
          <button onClick={() => setRole('mgr')} className={`p-[14px] rounded-lg text-center border-[1.5px] transition-all cursor-pointer ${role === 'mgr' ? 'border-primary bg-primary-light' : 'border-border bg-white'}`}>
            <div className="flex justify-center mb-1 text-primary"><Icon name="chart" size={22} /></div>
            <div className="text-[12px] font-extrabold text-t1">Manager</div>
            <div className="text-[10px] text-t2">ผู้จัดการ</div>
          </button>
        </div>

        <button onClick={doLogin} className="btn-p cursor-pointer">เข้าสู่ระบบ / Login</button>
        <p className="text-[10px] text-t3 text-center pt-4">Toyota NextGen</p>
      </div>
    </div>
  );
}
