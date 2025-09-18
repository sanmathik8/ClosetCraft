// pages/index.tsx
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import styled, { createGlobalStyle } from "styled-components";
import { motion, useScroll, useTransform } from "framer-motion";
import { FaUserCircle } from "react-icons/fa";

const GlobalStyle = createGlobalStyle`
  html, body {
    margin: 0;
    padding: 0;
    font-family: 'Playfair Display', serif;
    background-color: #fdfdfd;
    color: #111;
    scroll-behavior: smooth;
    overflow-x: hidden;
  }
  #__next {
    height: 100%;
    background-color: #fdfdfd;
  }
`;

const PremiumNavBar = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10001;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 3rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(15px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    padding: 1rem 1.5rem;
  }
`;

const Logo = styled.div`
  font-family: 'Great Vibes', cursive;
  font-size: 2.5rem;
  color: #b3740f;
  letter-spacing: 1px;
  text-shadow: 1px 1px 3px rgba(0,0,0,0.15);
  cursor: pointer;

  &:hover {
    color: #d9a440;
    transform: scale(1.05);
    transition: all 0.3s ease;
  }
`;

const PremiumNavLinks = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;

  a {
    padding: 0.5rem 1rem;
    border-radius: 12px;
    font-weight: 500;
    font-size: 0.95rem;
    text-decoration: none;
    transition: all 0.25s ease;
    box-shadow: 0 2px 6px rgba(0,0,0,0.1);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
  }

  .explore {
    background: linear-gradient(135deg, #ff9f43, #ff6b6b);
    color: white;
  }

  .login {
    background: #fdfdfd;
    color: #333;
    border: 1px solid #ddd;
  }

  .register {
    background: linear-gradient(135deg, #8e2de2, #4a00e0);
    color: white;
  }

  .about {
    background: #f0f0f5;
    color: #5d5d7a;
  }

  .cart {
    background: #fff0f5;
    color: #b4005a;
  }

  .orders {
    background: #f0f9ff;
    color: #004488;
  }
`;

const Section = styled.section`
  position: relative;
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  scroll-snap-align: start;
  padding: 6rem 1rem 2rem;
  flex-direction: column;
`;

const Background = styled(motion.div)<{ bgUrl: string }>`
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: url(${props => props.bgUrl});
  background-size: cover;
  background-position: center;
  z-index: 0;
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(255, 255, 255, 0.35);
    z-index: 1;
  }
`;

const Content = styled(motion.div)`
  z-index: 2;
  max-width: 900px;
  padding: 2rem;
  text-align: center;
`;

const ImageOverlayWrapper = styled.div`
  position: relative;
  max-width: 400px;
  width: 100%;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0,0,0,0.3);
  margin: 1rem auto;
`;

const TextCard = styled.div`
  margin: 1rem auto;
  padding: 2rem 2.5rem;
  background: rgba(255,255,255,0.9);
  border-radius: 20px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.1);
  max-width: 550px;
  text-align: center;
  backdrop-filter: blur(12px);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }

  h1,h2 {
    margin-bottom: 0.5rem;
    font-family: 'Playfair Display', serif;
  }
  p {
    margin: 0;
    font-size: 1rem;
    color: #333;
  }
`;

const ExploreNowContainer = styled.div`
  position: fixed;
  top: 55%;
  right: 5%;
  transform: translateY(-50%);
  z-index: 5;
  background: linear-gradient(145deg, #ffe6f0, #fff5e6);
  padding: 1.5rem;
  border-radius: 25px;
  box-shadow: 0 15px 40px rgba(0,0,0,0.2);
  text-align: center;
  width: 280px;
  font-family: 'Playfair Display', serif;
  animation: floatIn 1s ease-out;
  opacity: 0.95;

  @keyframes floatIn {
    from { opacity: 0; transform: translateY(-60%);}
    to { opacity: 0.95; transform: translateY(-50%);}
  }

  @media (max-width: 768px) {
    position: static;
    width: 90%;
    margin: 2rem auto;
    transform: none;
  }
`;

const StartButton = styled.button`
  margin-top: 1rem;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  background: linear-gradient(135deg, #ff6b6b, #ff9f43);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0,0,0,0.2);
  }
`;

const ScrollIndicator = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 5px;
  background: #b3740f;
  z-index: 10000;
`;

const MotionImage = motion(Image);

const Loader = styled.div`
  position: fixed;
  top:0; left:0; right:0; bottom:0;
  display:flex;
  align-items:center;
  justify-content:center;
  font-size:2rem;
  background:#fdfdfd;
  z-index:9999;
`;

const HomePage = () => {
  const { scrollYProgress } = useScroll();
  const fabricY = useTransform(scrollYProgress, [0,1], ["0%","-50%"]);
  const floralY = useTransform(scrollYProgress, [0,1], ["0%","-40%"]);
  const laceY = useTransform(scrollYProgress, [0,1], ["0%","-30%"]);
  const scrollWidth = useTransform(scrollYProgress, [0,1], ["0%","100%"]);

  const [loading,setLoading] = useState(true);
  const [user,setUser] = useState<{name?:string,email?:string}|null>(null);
  const [showUserMenu,setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(()=>{
    const timer = setTimeout(()=>setLoading(false),1200);
    return ()=>clearTimeout(timer);
  },[]);

  useEffect(()=>{
    const storedUser = typeof window!=="undefined" && localStorage.getItem("user");
    if(storedUser) setUser(JSON.parse(storedUser));
  },[]);

  useEffect(()=>{
    const handleClickOutside = (e:MouseEvent)=>{
      if(menuRef.current && !menuRef.current.contains(e.target as Node)) setShowUserMenu(false);
    };
    document.addEventListener("mousedown",handleClickOutside);
    return ()=>document.removeEventListener("mousedown",handleClickOutside);
  },[]);

  const handleLogout=()=>{
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
  };

  if(loading) return <Loader>Loading Fashion...</Loader>;

  return <>
    <GlobalStyle />
    <ScrollIndicator style={{width:scrollWidth.get()}}/>

    {/* Navbar */}
    <PremiumNavBar>
      <Logo onClick={()=>router.push("/")}>Closet Craft</Logo>
      <PremiumNavLinks>
        <a href="/explore" className="explore">Explore</a>
        {!user && <>
          <a href="/login" className="login">Login</a>
          <a href="/register" className="register">Register</a>
        </>}
        <a href="/about" className="about">About Us</a>
        <a href="/cart" className="cart">Cart</a>
        <a href="/your-order" className="orders">Orders</a>
        {user && <div ref={menuRef} style={{position:"relative"}}>
          <FaUserCircle size={28} style={{cursor:"pointer"}} onClick={()=>setShowUserMenu(p=>!p)}/>
          {showUserMenu && <div style={{
            position:"absolute",top:"120%",right:0,
            background:"white",boxShadow:"0 4px 12px rgba(0,0,0,0.1)",
            padding:"1rem",borderRadius:"10px",minWidth:"160px", zIndex:10000
          }}>
            <p style={{marginBottom:"0.5rem"}}>👋 {user.name||user.email}</p>
            <a href="/cart" style={{display:"block",marginBottom:"0.5rem",color:"#333"}}>🛒 My Cart</a>
            <button onClick={handleLogout} style={{
              width:"100%", background:"#111", color:"white", padding:"0.5rem",
              border:"none",borderRadius:"5px", cursor:"pointer", fontSize:"0.9rem"
            }}>Logout</button>
          </div>}
        </div>}
      </PremiumNavLinks>
    </PremiumNavBar>

    {/* Section 1 */}
    <Section>
      <Background bgUrl="https://w0.peakpx.com/wallpaper/1009/703/HD-wallpaper-fabric-abstract-pattern-fabric-textures-geometric-ornaments-fabric-patterns-fabric-backgrounds.jpg" style={{y:fabricY}}/>
      <Content initial={{opacity:0,y:60}} whileInView={{opacity:1,y:0}} transition={{duration:1}}>
        <ImageOverlayWrapper>
          <MotionImage src="https://img.freepik.com/free-photo/portrait-beautiful-cute-brunette-woman-model-casual-summer-dress-with-no-makeup-isolated-white-full-length_158538-23330.jpg" alt="Header Girl" layout="responsive" width={400} height={933} initial={{opacity:0,scale:0.8}} whileInView={{opacity:1,scale:1}} transition={{duration:1}} priority/>
        </ImageOverlayWrapper>
        <TextCard>
          <h1>Elegance in Every Thread</h1>
          <p>Welcome to the world where every fabric tells a story.</p>
        </TextCard>
      </Content>
    </Section>

    {/* Section 2 */}
    <Section>
      <Background bgUrl="https://images.unsplash.com/photo-1496747611176-843222e1e57c?fm=jpg&q=60&w=3000" style={{y:floralY}}/>
      <Content initial={{opacity:0,y:60}} whileInView={{opacity:1,y:0}} transition={{duration:1}}>
        <ImageOverlayWrapper>
          <MotionImage src="https://cdn.pixabay.com/photo/2021/09/15/12/34/woman-6626742_1280.jpg" alt="Content Girl" layout="responsive" width={400} height={700} initial={{opacity:0,scale:0.8}} whileInView={{opacity:1,scale:1}} transition={{duration:1}}/>
        </ImageOverlayWrapper>
        <TextCard>
          <h2>Celebrating Individuality</h2>
          <p>Our fashion reflects every woman’s vibrant story.</p>
        </TextCard>
      </Content>
    </Section>

    {/* Section 3 */}
    <Section>
      <Background bgUrl="https://static.vecteezy.com/system/resources/previews/035/977/673/non_2x/ai-generated-close-up-of-white-lace-fabric-with-flowers-background-and-texture-a-delicate-and-intricate-texture-of-lace-ai-generated-free-photo.jpg" style={{y:laceY}}/>
      <Content initial={{opacity:0,y:60}} whileInView={{opacity:1,y:0}} transition={{duration:1}}>
        <ImageOverlayWrapper>
          <MotionImage src="https://img.freepik.com/free-photo/happy-lady-stylish-skirt-boater-posing-pink-wall_197531-23653.jpg?semt=ais_hybrid&w=740" alt="Dress Maker" layout="responsive" width={400} height={700} initial={{opacity:0,scale:0.8}} whileInView={{opacity:1,scale:1}} transition={{duration:1}}/>
        </ImageOverlayWrapper>
        <TextCard>
          <h2>Crafted with Passion</h2>
          <p>Every stitch made with precision and care.</p>
        </TextCard>
      </Content>
    </Section>

    {/* CTA */}
    <ExploreNowContainer>
      <h2>Explore Our Collection</h2>
      <p>Discover the elegance that suits your style.</p>
      <StartButton onClick={()=>router.push("/explore")}>Start Now</StartButton>
    </ExploreNowContainer>
  </>
};

export default HomePage;
