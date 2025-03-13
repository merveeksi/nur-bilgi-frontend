import Image from 'next/image'
import Link from 'next/link'

const Logo = () => {
  return (
    <Link href="/">
      <div className="flex items-center justify-center border-2 border-emerald-800 rounded-full p-0 overflow-hidden"
         style={{
           boxShadow: "0 0 20px rgba(16, 185, 129, 0.5), 0 0 40px rgba(16, 185, 129, 0.3)",
           width: "70px",
           height: "70px"
         }}>
        <Image 
          src="/images/nurbilgi.logo.png" 
          alt="logo" 
          width={66} 
          height={66} 
          priority={true} 
          className="rounded-full" 
        />
      </div>
    </Link>
  );
}

export default Logo;