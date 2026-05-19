import { Play } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  return (
    <div className="nav-wrapper">
      <nav className="nav-container">
        <Link href="/" className="nav-logo">
          <img src="/pritheeve-logo.png" alt="Pritheeve" className="nav-logo-image" />
        </Link>
        
        <ul className="nav-links">
          <li><Link href="/" className="active">Home</Link></li>
          <li><Link href="#about">About</Link></li>
          <li><Link href="#block">Block</Link></li>
          <li><Link href="#pages">Pages</Link></li>
          <li><Link href="#contact">Contact</Link></li>
        </ul>
        
        <Link href="#contact" className="btn-hire">
          Hire me <Play size={10} fill="currentColor" style={{ marginLeft: '4px' }} />
        </Link>
      </nav>
    </div>
  );
}
