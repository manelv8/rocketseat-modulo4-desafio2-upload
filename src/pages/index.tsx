import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';
import { useEffect } from 'react';

export default function Home(): JSX.Element {
  const fetchImages = async ({pageParam = null}) => {
    // await setTimeout(()=>{console.log('yeye')},5000);
    const response = await api.get(
      "/api/images",
      {params: {after: pageParam}}
      )
    return response.data;
  }
  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    'images',
    // TODO AXIOS REQUEST WITH PARAM
    fetchImages
    ,
    // TODO GET AND RETURN NEXT PAGE PARAM
    {getNextPageParam: (dataResult) => dataResult?.after || null }
  );

  const formattedData = useMemo(() => {
    // TODO FORMAT AND FLAT DATA ARRAY
    return data?.pages.map(item => {
      
      return item.data
    }).flat()

  }, [data]);

  
  // TODO RENDER LOADING SCREEN
  if(isLoading){
    return <Loading/>
  }

  // TODO RENDER ERROR SCREEN
  if(isError){
    return <Error/>
  }
  
  function handleGetMore(){
    fetchNextPage();
   
  }

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />

        {
        /* TODO RENDER LOAD MORE BUTTON IF DATA HAS NEXT PAGE */
        hasNextPage && (
        <Button mt={6} onClick={handleGetMore}>{isFetchingNextPage ? 'Carregando...' : 'Carregar mais'}</Button>
        
        )}
      </Box>
    </>
  );
}
