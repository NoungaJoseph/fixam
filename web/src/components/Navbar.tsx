import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, ChevronDown, User, Briefcase, Info, PlusCircle, LayoutGrid, Zap, ArrowRight, ShieldCheck, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [talentDropdownOpen, setTalentDropdownOpen] = useState(false);
  const [search, setSearch] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/providers?search=${encodeURIComponent(search)}`);
    }
  };

  return (
    <header className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="container">
        <div className="flex justify-between items-center gap-6">
          <div className="flex items-center gap-10">
            <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--primary)', letterSpacing: '-0.05em' }}>
              FIXAM.
            </Link>
            
            <nav className="flex items-center gap-10" style={{ display: window.innerWidth > 1024 ? 'flex' : 'none' }}>
          <div className="nav-dropdown-trigger">
            <span className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Find Talent <ChevronDown size={14} />
            </span>
            <div className="nav-dropdown-content">
              <Link to="/providers" className="dropdown-item">
                <div className="dropdown-item-icon"><Search size={20} /></div>
                <div className="dropdown-item-text">
                  <h4>Marketplace</h4>
                  <p>Browse verified professionals</p>
                </div>
              </Link>
              <Link to="/categories" className="dropdown-item">
                <div className="dropdown-item-icon"><Zap size={20} /></div>
                <div className="dropdown-item-text">
                  <h4>Categories</h4>
                  <p>Explore by specialty</p>
                </div>
              </Link>
              <Link to="/post-task" className="dropdown-item">
                <div className="dropdown-item-icon"><ArrowRight size={20} /></div>
                <div className="dropdown-item-text">
                  <h4>Post a Job</h4>
                  <p>Describe what you need</p>
                </div>
              </Link>
            </div>
          </div>

          <div className="nav-dropdown-trigger">
            <span className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Why Fixam <ChevronDown size={14} />
            </span>
            <div className="nav-dropdown-content">
              <Link to="/how-it-works" className="dropdown-item">
                <div className="dropdown-item-icon"><ShieldCheck size={20} /></div>
                <div className="dropdown-item-text">
                  <h4>How it Works</h4>
                  <p>Our platform mission</p>
                </div>
              </Link>
              <Link to="/how-it-works" className="dropdown-item">
                <div className="dropdown-item-icon"><Star size={20} /></div>
                <div className="dropdown-item-text">
                  <h4>Fixam Quality</h4>
                  <p>Verification & trust</p>
                </div>
              </Link>
            </div>
          </div>

          <Link to="/register?role=provider" className="nav-link">Find Work</Link>
        </nav>
          </div>

          <div className="flex items-center gap-6">
            <form onSubmit={handleSearch} style={{ position: 'relative', display: window.innerWidth > 640 ? 'block' : 'none' }}>
              <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', width: '1rem', height: '1rem', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                placeholder="Search services..." 
                className="input-field"
                style={{ width: '240px', paddingLeft: '3rem', borderRadius: '99px', fontSize: '0.875rem' }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </form>
            
            {user ? (
              <Link to="/home" className="btn-primary">
                My Dashboard
              </Link>
            ) : (
              <div className="flex items-center gap-6">
                <Link to="/login" className="nav-link">Log In</Link>
                <Link to="/register" className="btn-navy">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
