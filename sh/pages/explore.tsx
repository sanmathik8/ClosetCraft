import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/router';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    background: linear-gradient(135deg, #fdfcfb, #e2d1c3);
    font-family: 'Playfair Display', serif;
  }
`;

const Wrapper = styled.div`
  position: relative;
  padding: 6rem 2rem 4rem 2rem;
  max-width: 1600px;
  margin: auto;
  z-index: 0;
`;

const FloatingFlower = styled(motion.img)`
  position: absolute;
  width: 60px;
  opacity: 0.25;
  pointer-events: none;
  z-index: 0;
  animation: float 8s ease-in-out infinite;

  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
    100% { transform: translateY(0px); }
  }

  @media (max-width: 768px) {
    width: 40px;
  }
`;

const Title = styled.h1`
  font-size: 3rem;
  text-align: center;
  margin-bottom: 3rem;
  color: #111;
  position: relative;
  z-index: 1;

  @media (max-width: 1024px) {
    font-size: 2.5rem;
  }

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 2rem;
  justify-items: center;
  position: relative;
  z-index: 1;
`;

const Card = styled(motion.div)`
  width: 220px;
  height: 120px;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.25);
  border-radius: 20px;
  padding: 1.2rem;
  text-align: center;
  color: #222;
  font-weight: 600;
  font-size: 1.2rem;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 0.05em;
  text-transform: capitalize;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;

  &::after {
    content: "";
    position: absolute;
    font-size: 2rem;
    color: rgba(115, 70, 70, 0.15);
    bottom: 10px;
    right: 10px;
    pointer-events: none;
  }

  &:hover {
    transform: scale(1.05) translateY(-5px);
    box-shadow: 0 25px 60px rgba(0, 0, 0, 0.15);
    background: rgba(255, 255, 255, 0.35);
  }

  @media (max-width: 1024px) {
    width: 200px;
    height: 110px;
    font-size: 1.1rem;
  }

  @media (max-width: 768px) {
    width: 180px;
    height: 100px;
    font-size: 1rem;
  }
`;

const QuoteSection = styled(motion.div)`
  max-width: 550px;
  margin: 5rem auto 2rem auto;
  padding: 3.8rem 3.2rem;
  text-align: center;
  color: #0e0708ff;
  line-height: 1.5;
  font-size: 1.7rem;
  position: relative;
  z-index: 1;
  font-family: 'Lora', serif;

  &::before,
  &::after {
    content: '“';
    font-weight: 900;
    font-size: 5.5rem;
    color: #734646ff;
    position: absolute;
    opacity: 0.9;
    line-height: 0;
  }

  &::after {
    bottom: -15px;
    right: 25px;
    transform: rotate(190deg);
  }

  &::before {
    top: -15px;
    left: 25px;
  }

  @media (max-width: 768px) {
    font-size: 1.4rem;
    padding: 2.8rem 2rem;
    max-width: 90%;
  }
`;

// Back button styled component
const BackButton = styled.button`
  position: fixed;
  top: 2rem;
  left: 2rem;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  background-color: #ffb6b6;
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
  transition: transform 0.2s ease, background-color 0.2s ease;

  &:hover {
    transform: scale(1.1);
    background-color: #ff8c8c;
  }
`;

const ExplorePage = () => {
  const router = useRouter();

  const categories = [
    "blouse","cotton","crop","dupatta","embroidered","ethnic","floral",
    "jacket","jeans","jumpsuit","kurta","lehenga","motifs","palazzos",
    "printed","saree","shorts","silk","skirt","sweatshirt","top","trousers","unstitched"
  ];

  const flowers = [
    "https://www.svgrepo.com/show/438976/flower-orange-organic.svg",
    "https://www.svgrepo.com/show/362097/flower.svg",
    "https://www.svgrepo.com/show/267577/flower-sunflower.svg",
    "https://www.svgrepo.com/show/438972/flower-green.svg",
    "https://www.svgrepo.com/show/398525/tulip.svg"
  ];

  const flowerPositions = [
    { top: '5%', left: '10%', rotate: '0deg' },
    { top: '15%', right: '8%', rotate: '20deg' },
    { bottom: '10%', left: '15%', rotate: '-15deg' },
    { bottom: '15%', right: '12%', rotate: '10deg' },
    { top: '8%', right: '25%', rotate: '-20deg' },
  ];

  return (
    <>
      <GlobalStyle />
      <Wrapper>
        {/* Back Button */}
        <BackButton onClick={() => router.push("/")}>
          &larr;
        </BackButton>

        <Title>Discover Our Styles</Title>

        {flowerPositions.map((pos, i) => (
          <FloatingFlower
            key={i}
            src={flowers[i % flowers.length]}
            alt={`decorative flower ${i}`}
            style={{ ...pos }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.25, scale: 1, rotate: pos.rotate }}
            transition={{ duration: 1.5, delay: i * 0.3 }}
          />
        ))}

        <Grid>
          {categories.map((item, index) => (
            <Link key={item} href={`/category/${item}`}>
              <Card
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.03 }}
              >
                {item}
              </Card>
            </Link>
          ))}
        </Grid>

        <QuoteSection
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          Craft your closet with our clothes
        </QuoteSection>
      </Wrapper>
    </>
  );
};

export default ExplorePage;
