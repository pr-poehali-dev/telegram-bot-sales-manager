import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import { articles } from "@/data/articles";
import { ArticleCard } from "@/components/ArticleCard";
import { Link } from "react-router-dom";
import { useState } from "react";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("Все");

  const categories = ["Все", "Дизайн", "Маркетинг", "SEO", "Разработка"];

  const filteredArticles = selectedCategory === "Все" 
    ? articles 
    : articles.filter(article => article.category === selectedCategory);

  const featuredArticle = articles[0];

  return (
    <div className="min-h-screen">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Icon name="Newspaper" className="text-white" size={20} />
              </div>
              <span className="text-xl font-display font-bold">NewsHub</span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              {categories.slice(1).map((category) => (
                <button 
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  {category}
                </button>
              ))}
            </div>
            <Button className="hidden md:flex">
              <Icon name="PenSquare" size={16} className="mr-2" />
              Написать статью
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Icon name="Menu" size={20} />
            </Button>
          </div>
        </div>
      </nav>

      <section className="pt-28 pb-16 px-6">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12 animate-fade-in">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
              <Icon name="TrendingUp" size={14} className="mr-1" />
              Актуальные новости
            </Badge>
            <h1 className="text-5xl md:text-6xl font-display font-bold leading-tight mb-6">
              Лучшие статьи о
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary"> дизайне, маркетинге и технологиях</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Профессиональные материалы для тех, кто создаёт будущее интернета
            </p>
          </div>

          <Link to={`/article/${featuredArticle.id}`}>
            <div className="relative rounded-3xl overflow-hidden mb-12 group cursor-pointer animate-scale-in">
              <div className="aspect-[21/9] relative">
                <img 
                  src={featuredArticle.image}
                  alt={featuredArticle.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent"></div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                <Badge className="mb-4">{featuredArticle.category}</Badge>
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-white group-hover:text-primary transition-colors">
                  {featuredArticle.title}
                </h2>
                <p className="text-lg text-white/80 mb-6 max-w-2xl">
                  {featuredArticle.excerpt}
                </p>
                <div className="flex items-center gap-6 text-white/60">
                  <div className="flex items-center gap-2">
                    <Icon name="User" size={16} />
                    <span>{featuredArticle.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="Calendar" size={16} />
                    <span>{featuredArticle.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="Clock" size={16} />
                    <span>{featuredArticle.readTime}</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      <section className="py-12 px-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-display font-bold">Все статьи</h2>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="whitespace-nowrap"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article, index) => (
              <div 
                key={article.id} 
                className="animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ArticleCard {...article} />
              </div>
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <div className="text-center py-16">
              <Icon name="FileQuestion" size={48} className="mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-display font-bold mb-2">Статей не найдено</h3>
              <p className="text-muted-foreground mb-6">
                Попробуйте выбрать другую категорию
              </p>
              <Button onClick={() => setSelectedCategory("Все")}>
                Показать все статьи
              </Button>
            </div>
          )}
        </div>
      </section>

      <footer className="py-12 px-6 bg-muted/30 mt-20">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <Icon name="Newspaper" className="text-white" size={20} />
                </div>
                <span className="text-xl font-display font-bold">NewsHub</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Профессиональные статьи для специалистов
              </p>
            </div>
            <div>
              <h4 className="font-display font-bold mb-4">Категории</h4>
              <ul className="space-y-2">
                {categories.slice(1).map((category) => (
                  <li key={category}>
                    <button 
                      onClick={() => setSelectedCategory(category)}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {category}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-display font-bold mb-4">О нас</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Контакты</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">О проекте</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Реклама</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-display font-bold mb-4">Подписка</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Получайте лучшие статьи на почту
              </p>
              <div className="flex gap-2">
                <Button className="w-full">Подписаться</Button>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t text-center text-sm text-muted-foreground">
            © 2026 NewsHub. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
