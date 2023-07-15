import { ChakraProvider } from "@chakra-ui/react";

// @ts-ignore
function App({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default App;
