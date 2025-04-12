/* eslint-disable @next/next/no-img-element */
import { Envelope } from "@/components/Envelope";

function MainPage() {
  return (
    <main className="3xl:py-16 flex h-[100dvh] w-screen flex-col items-center bg-[url(/paper-texture-min.jpg)] bg-cover bg-center bg-no-repeat py-10">
      <img
        src="/welcomehome_logo.png"
        className="w-[270px] sm:w-auto object-cover lg:w-[230px] 2xl:w-[270px]"
      />
      <Envelope hint sending />
      <div className="3xl:bottom-20 absolute bottom-[12.5%] left-1/2 flex w-full -translate-x-1/2 flex-col text-xl text-[#BF1E2E] lg:bottom-10">
        <p className="font-chi w-full text-center text-lg lg:text-4xl">
          写下一段欢迎他/她的话语，
          <br />
          再把它转发给你想珍惜他/她来到我们的大家庭。
        </p>

        <p className="font-en w-[75%] self-center text-center text-sm lg:text-lg">
          Write a message to someone and forward it.
        </p>
      </div>
    </main>
  );
}

export default MainPage;
