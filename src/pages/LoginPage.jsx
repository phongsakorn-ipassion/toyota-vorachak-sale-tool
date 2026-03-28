import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import Icon from '../components/icons/Icon';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const loginWithSupabase = useAuthStore((s) => s.loginWithSupabase);

  const [selectedRole, setSelectedRole] = useState('sales');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDemoLogin = (role) => {
    login(role);
    navigate(role === 'mgr' ? '/mgr-dash' : '/sales-dash');
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setError('กรุณากรอกอีเมลและรหัสผ่าน');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await loginWithSupabase(email, password, selectedRole);
      navigate(selectedRole === 'mgr' ? '/mgr-dash' : '/sales-dash');
    } catch (err) {
      setError(err.message || 'เข้าสู่ระบบไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    {
      id: 'sales',
      icon: 'users',
      title: 'พนักงานขาย',
      subtitle: 'View your leads',
    },
    {
      id: 'mgr',
      icon: 'chart',
      title: 'ผู้จัดการ',
      subtitle: 'Manage team pipeline',
    },
  ];

  return (
    <div className="min-h-full bg-bg flex flex-col items-center justify-center p-6">
      {/* Logo area */}
      <div className="flex flex-col items-center mb-7">
        <div className="w-[72px] h-[72px] rounded-full bg-primary flex items-center justify-center mb-3">
          <Icon name="car" size={34} className="text-white" />
        </div>
        <h1 className="text-[20px] font-extrabold text-t1">Toyota Sale Tool</h1>
        <p className="text-[12px] text-t2 mt-0.5">วรจักร์ยนต์</p>
      </div>

      {/* Role selector */}
      <div className="grid grid-cols-2 gap-[10px] w-full mb-5">
        {roles.map((r) => (
          <button
            key={r.id}
            onClick={() => setSelectedRole(r.id)}
            className={`
              rounded-lg py-[14px] px-2 text-center
              transition-colors cursor-pointer
              ${
                selectedRole === r.id
                  ? 'border-primary bg-primary-light'
                  : 'border-border bg-white'
              }
            `.trim()}
            style={{ borderWidth: '1.5px', borderStyle: 'solid', borderColor: selectedRole === r.id ? 'var(--p)' : 'var(--border)' }}
          >
            <div className="mb-1 flex justify-center">
              <Icon
                name={r.icon}
                size={26}
                className={selectedRole === r.id ? 'text-primary' : 'text-t3'}
              />
            </div>
            <div className="text-[12px] font-extrabold text-t1">{r.title}</div>
            <div className="text-[10px] text-t2">{r.subtitle}</div>
          </button>
        ))}
      </div>

      {/* Login form */}
      <div className="w-full">
        <div className="mb-3">
          <label className="text-[10px] font-extrabold text-t2 uppercase tracking-wide block mb-1">อีเมล</label>
          <Input
            icon="mail"
            placeholder="อีเมล / Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
          />
        </div>
        <div className="mb-3">
          <label className="text-[10px] font-extrabold text-t2 uppercase tracking-wide block mb-1">รหัสผ่าน</label>
          <Input
            icon="lock"
            placeholder="รหัสผ่าน / Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          />
        </div>

        {error && (
          <p className="text-red-500 text-xs mb-3 text-center">{error}</p>
        )}

        <Button
          variant="primary"
          fullWidth
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
        </Button>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 w-full my-5">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-t3">หรือ</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Demo buttons */}
      <div className="flex gap-[10px] w-full">
        <button
          className="btn-o flex-1"
          onClick={() => handleDemoLogin('sales')}
        >
          Demo Sales
        </button>
        <button
          className="btn-o flex-1"
          onClick={() => handleDemoLogin('mgr')}
        >
          Demo Manager
        </button>
      </div>
    </div>
  );
}
