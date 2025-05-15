import AuthProvider from "./AuthProvider/AuthProvide";
import Navbar from "./Navbar/Navbar";

export default function Layout({ children }) {
  return (
    <>
      <AuthProvider>
        <Navbar />
        <main>{children}</main>
      </AuthProvider>
    </>
  );
}
