'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PromptCard from './PromptCard';

const PromptCardList = ({data, handleTagClick }) => {
  return (
    <div className='mt-16 prompt_layout'>
      { data.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
          handleTagClick={() => handleTagClick(post.tag)}
        />
      ))}
    </div>
  )
}

// Implement View other profiles
const Feed = () => {
  const [posts, setPosts] = useState([]);

  // Search states
  const [searchText, setSearchText] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchedResults, setSearchedResults] = useState([]);

  const router = useRouter();

  const fetchPosts = async() => {
    const response = await fetch('/api/prompt');
    const data = await response.json();
    setPosts(data);
  }

  const filterPrompts = (searchText) => {
    if (!searchText) {
      return posts;
    }

    const regex = new RegExp(searchText, "i");

    return posts.filter(
      (item) =>
        regex.test(item.creator.username) ||
        regex.test(item.tag) ||
        regex.test(item.prompt)
    );
  }

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    // debounce method
    setSearchTimeout(
      setTimeout(() => { 
        const searchResult = filterPrompts(searchText);
        setSearchedResults(searchResult);
    }, 500));
  }

  const handleTagClick = (tagName) => {
    setSearchText(tagName);
    const searchResult = filterPrompts(tagName);
    setSearchedResults(searchResult);
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <section className='feed'>
      <form className='relative w-full flex-center'>
        <input
          type="text"
          placeholder='Search for a tag or a username'
          value={searchText}
          onChange={handleSearchChange}
          className='search_input'
        />
      </form>
      {
        searchText ? (
          <PromptCardList
            data={searchedResults}
            handleTagClick={handleTagClick}
          />  
        ) : (
          <PromptCardList
            data={posts}
            handleTagClick={handleTagClick}
          />
        )
      }
    </section>
  )
}

export default Feed