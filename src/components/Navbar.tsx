import { Play } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  return (
    <div className="nav-wrapper">
      <nav className="nav-container">
        <Link href="#home" className="nav-logo">
          <img src="/pritheeve-logo.png" alt="Pritheeve" className="nav-logo-image" />
        </Link>
        
        <ul className="nav-links">
          <li><Link href="#home" className="active">Home</Link></li>
          <li><Link href="#about">About</Link></li>
          <li><Link href="#experience">Experience</Link></li>
          <li><Link href="#projects">Projects</Link></li>
          <li><Link href="#technical-skills">Skills</Link></li>
          <li><Link href="#contact">Contact</Link></li>
        </ul>
        
        <Link href="#contact" className="btn-hire">
          Hire me <Play size={10} fill="currentColor" style={{ marginLeft: '4px' }} />
        </Link>
      </nav>
    </div>
  );
}
