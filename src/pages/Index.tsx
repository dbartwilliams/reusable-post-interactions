
import React from 'react';
import PostActions from '../components/PostActions';

const Index = () => {
  // Example usage of PostActions component
  const handleLike = async () => {
    console.log('Like clicked');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-4xl font-bold mb-8 text-center">Post Actions Demo</h1>
        
        <div className="bg-white rounded-lg shadow-md">
          <PostActions
            likes={5}
            comments={3}
            hasLiked={false}
            isLiking={false}
            showComments={false}
            onLike={handleLike}
            onToggleComments={() => console.log('Toggle comments')}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
