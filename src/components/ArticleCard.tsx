import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import { Link } from "react-router-dom";

interface ArticleCardProps {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
  author: string;
  readTime: string;
}

export const ArticleCard = ({ 
  id, 
  title, 
  excerpt, 
  image, 
  category, 
  date, 
  author, 
  readTime 
}: ArticleCardProps) => {
  return (
    <Link to={`/article/${id}`}>
      <Card className="overflow-hidden group cursor-pointer border-2 hover:shadow-xl transition-all duration-300 h-full flex flex-col">
        <div className="relative overflow-hidden aspect-video">
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-4 left-4">
            <Badge className="bg-primary text-primary-foreground">
              {category}
            </Badge>
          </div>
        </div>
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="text-xl font-display font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {title}
          </h3>
          <p className="text-muted-foreground mb-4 line-clamp-3 flex-grow">
            {excerpt}
          </p>
          <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Icon name="User" size={14} />
                <span>{author}</span>
              </div>
              <div className="flex items-center gap-1">
                <Icon name="Clock" size={14} />
                <span>{readTime}</span>
              </div>
            </div>
            <span>{date}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
};
