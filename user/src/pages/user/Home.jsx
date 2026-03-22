import BulkDeals from "../../components/user/home/BulkDeals";
import CategoryGridCarousel from "../../components/user/home/CategoryGrid";
import FeaturedProducts from "../../components/user/home/FeaturedProducts";
import HeroSection from "../../components/user/home/HeroSection";
import StatsSection from "../../components/user/home/StatsSection";
import TopSuppliersCarousel from "../../components/user/home/TopSuppliersCarousel";
import UserLayout from "../../components/UserLayout";

const Home = () => {
  return (
    <UserLayout>
      {" "}
      <div className="min-h-screen bg-gray-50">
        <HeroSection />
        <CategoryGridCarousel />
        <FeaturedProducts />
        <TopSuppliersCarousel />
        <BulkDeals />
        <StatsSection />
      </div>{" "}
    </UserLayout>
  );
};

export default Home;
