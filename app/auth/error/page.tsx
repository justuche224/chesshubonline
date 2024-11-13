import { Header } from "@/components/auth/Header";
import BackButton from "@/components/auth/BackButton";
import { Card, CardHeader, CardFooter } from "@/components/ui/card";

const AuthErrorPage = () => {
  return (
    <Card className="w-[400px] shadow-md">
      <CardHeader>
        <Header label="Oops! something went wrong" />
      </CardHeader>
      <CardFooter>
        <BackButton label="Back to login" href="/auth/login" />
      </CardFooter>
    </Card>
  );
};

export default AuthErrorPage;
