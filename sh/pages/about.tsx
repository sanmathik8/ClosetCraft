// pages/about.tsx
import { useRouter } from "next/router";
import styled, { createGlobalStyle } from "styled-components";
import { motion } from "framer-motion";
import { FaArrowLeft } from "react-icons/fa";

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: 'Playfair Display', serif;
    background-color: #fdfdfd;
    color: #111;
    overflow-x: hidden;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #ff91a4;
  color: white;
  border: none;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 2rem;
  font-weight: 500;
  transition: background-color 0.3s;

  &:hover {
    background-color: #e64b6f;
  }
`;

const HeroSection = styled.section`
  position: relative;
  background-image: url('https://plus.unsplash.com/premium_photo-1664202526559-e21e9c0fb46a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZmFzaGlvbnxlbnwwfHwwfHx8MA%3D%3D');
  background-size: cover;
  background-position: center;
  height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
`;

const HeroOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.5);
`;

const HeroContent = styled(motion.div)`
  position: relative;
  z-index: 2;
  max-width: 700px;
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
`;

const Section = styled.section`
  margin: 4rem 0;
  display: flex;
  flex-direction: column;
  gap: 2rem;

  @media(min-width:768px){
    flex-direction: row;
    gap: 4rem;
  }
`;

const ImageWrapper = styled.div`
  flex: 1;
  img {
    width: 100%;
    border-radius: 20px;
    object-fit: cover;
    box-shadow: 0 10px 40px rgba(0,0,0,0.2);
  }
`;

const TextWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;

  h2 {
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1rem;
    line-height: 1.8;
    color: #444;
  }
`;

const ValuesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-top: 2rem;

  @media(min-width:768px){
    grid-template-columns: repeat(3, 1fr);
  }
`;

const ValueCard = styled.div`
  background: #fff0f5;
  padding: 2rem;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
  transition: transform 0.3s;

  &:hover {
    transform: translateY(-5px);
  }

  h3 {
    margin-bottom: 0.5rem;
  }

  p {
    color: #555;
  }
`;

const CTASection = styled.section`
  text-align: center;
  margin: 6rem 0;
`;

const CTAButton = styled.button`
  background-color: #ff91a4;
  color: white;
  padding: 1rem 2rem;
  border-radius: 10px;
  border: none;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #e64b6f;
  }
`;

export default function AboutPage() {
  const router = useRouter();

  return (
    <>
      <GlobalStyle />
      <Container>
        <BackButton onClick={() => router.push("/")}>
          <FaArrowLeft /> Back to Home
        </BackButton>

        <HeroSection>
          <HeroOverlay />
          <HeroContent
            initial={{opacity:0, y:50}}
            animate={{opacity:1, y:0}}
            transition={{duration:1}}
          >
            <Title>CLOSETCRAFT</Title>
            <Subtitle>Elegance, style, and passion woven into every thread.</Subtitle>
          </HeroContent>
        </HeroSection>

        <Section>
          <ImageWrapper>
            <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmFzaGlvbnxlbnwwfHwwfHx8MA%3D%3D" alt="Fashion Story" />
          </ImageWrapper>
          <TextWrapper>
            <h2>Our Story</h2>
            <p>
              CLOSETCRAFT was founded to bring timeless fashion to everyone who values elegance and style. We combine contemporary trends with classic craftsmanship to make pieces that tell your story.
            </p>
          </TextWrapper>
        </Section>

        <Section>
          <TextWrapper>
            <h2>Mission & Vision</h2>
            <p>
              Our mission is to empower every individual to feel confident and stylish. Through sustainable practices, premium fabrics, and unique designs, we aim to redefine fashion with purpose.
            </p>
          </TextWrapper>
          <ImageWrapper>
            <img src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8ZmFzaGlvbnxlbnwwfHwwfHx8MA%3D%3D" alt="Mission" />
          </ImageWrapper>
        </Section>

        <Section>
          <ImageWrapper>
            <img src="https://media.istockphoto.com/id/2184718397/photo/interested-woman-chooses-clothes-to-buy-in-store-holds-hanger-with-dress-in-hands-looks-price.webp?a=1&b=1&s=612x612&w=0&k=20&c=1FiInrFOPsfgYHtwbRIgXUeT8_VNPPuPmhXjyW8NF4I=" alt="Team Work" />
          </ImageWrapper>
          <TextWrapper>
            <h2>Meet Our Team</h2>
            <p>
              Our designers, artisans, and innovators bring every collection to life with creativity, precision, and collaboration. We are dedicated to making fashion meaningful and beautiful.
            </p>
          </TextWrapper>
        </Section>

        <Section>
          <TextWrapper>
            <h2>Why Choose Us?</h2>
            <ValuesGrid>
              <ValueCard>
                <h3>Quality</h3>
                <p>Premium fabrics and exceptional craftsmanship.</p>
              </ValueCard>
              <ValueCard>
                <h3>Sustainability</h3>
                <p>Eco-friendly practices that protect the planet.</p>
              </ValueCard>
              <ValueCard>
                <h3>Innovation</h3>
                <p>Fresh designs that celebrate individuality.</p>
              </ValueCard>
            </ValuesGrid>
          </TextWrapper>
        </Section>

        <CTASection>
          <h2>Ready to Explore Our Collection?</h2>
          <CTAButton onClick={() => router.push("/explore")}>Start Now</CTAButton>
        </CTASection>
      </Container>
    </>
  );
}
