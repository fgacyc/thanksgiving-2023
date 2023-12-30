/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { type FunctionComponent, useState } from "react";
import { Formik, Form, Field } from "formik";
import { sendFetch, uploadFile } from "../helpers/uploadFile";
import { Oval } from "react-loader-spinner";
import * as Yup from "yup";
import { AiOutlineSave } from "react-icons/ai";
import { toJpeg } from "html-to-image";
import { toast } from "react-toastify";

interface EnvelopeProps {
  hint?: boolean;
  sending?: boolean;
  from?: string;
  to?: string;
  message?: string;
  image?: string | null;
}

export const Envelope: FunctionComponent<EnvelopeProps> = ({
  hint: hintDefault,
  sending,
  from,
  message,
  image,
  to,
}) => {
  const [open, setOpen] = useState(false);
  const [hint, setHint] = useState(hintDefault);
  const [file, setFile] = useState<File | undefined>();
  const [shareContent, setShareContent] = useState("");
  const [generatingImage, setGeneratingImage] = useState(false);

  return (
    <div
      className={`envelope${
        open ? " open" : " new cursor-pointer"
      } h-[250px] w-[325px] sm:h-[265px] sm:w-[370px] sm:max-w-[380px] lg:h-[300px] lg:w-[450px] lg:max-w-none 3xl:h-[366.66667px] 3xl:w-[550px] 3xl:max-w-none`}
      onClick={() => {
        setOpen(true);
        setHint(false);
      }}
    >
      <div className="back">
        {hint && (
          <div className="absolute left-1/2 top-1/3 z-10 flex w-full -translate-x-1/2 -translate-y-1/2 animate-pulse flex-col items-center justify-center text-black">
            <p className="font-chi text-2xl font-bold">点击打开</p>
            <p className="font-en text-lg">Click to open</p>
          </div>
        )}
        <div
          className={`letter ${
            generatingImage
              ? "static h-[65dvh]"
              : "h-[245px] w-[305px] sm:h-[260px] sm:w-[350px] lg:h-[290px] lg:w-[430px] 3xl:h-[346.66667px] 3xl:w-[530px]"
          }`}
        >
          {/* <h2>XX：</h2>
          <h3>XXXXXXX！</h3>
          <img
            src="https://medibangpaint.com/wp-content/uploads/2021/08/0.png"
            width="50%"
            height="50%"
          /> */}

          {sending ? (
            <Formik<{
              from: string;
              to: string;
              message: string;
            }>
              initialValues={{
                from: "",
                to: "",
                message: "",
              }}
              validationSchema={Yup.object().shape({
                from: Yup.string().required("Required."),
                to: Yup.string().required("Required."),
                message: Yup.string().required("Required."),
              })}
              onSubmit={async (values, actions) => {
                actions.setSubmitting(true);
                const id = toast.loading("卡片上传中... ");
                if (file) {
                  await uploadFile(file).then(async (data) => {
                    await sendFetch(
                      values.from,
                      values.to,
                      values.message,
                      `https://ywkl-image-storage.s3.ap-southeast-1.amazonaws.com/${data}`,
                    ).then(async (rt) => {
                      await rt.json().then((share) => {
                        toast.update(id, {
                          render: "卡片上传成功! 🎉",
                          type: "success",
                          isLoading: false,
                          autoClose: 2500,
                        });
                        setShareContent(share.id);
                        actions.setSubmitting(false);
                        actions.resetForm();
                      });
                    });
                  });
                } else {
                  await sendFetch(
                    values.from,
                    values.to,
                    values.message,
                    "",
                  ).then(async (rt) => {
                    await rt.json().then((share) => {
                      toast.update(id, {
                        render: "卡片上传成功! 🎉",
                        type: "success",
                        isLoading: false,
                        autoClose: 2500,
                      });
                      setShareContent(share.id);
                      actions.setSubmitting(false);
                      actions.resetForm();
                    });
                  });
                }
              }}
            >
              {({ isSubmitting, errors }) =>
                shareContent ? (
                  <div className="flex h-full flex-col items-center justify-center">
                    <p className="text-center font-chi text-lg font-bold">
                      把这封信交给他/她吧!
                    </p>
                    <p className="text-center font-en">
                      Share this letter to your loved ones!
                    </p>
                    <div className="flex flex-row-reverse gap-1 pt-3">
                      <button
                        className="rounded-2xl bg-green-400 px-4 py-1 font-en text-xs lg:px-7 lg:text-base"
                        type="button"
                        onClick={() =>
                          navigator.share === undefined
                            ? navigator.clipboard
                                .writeText(
                                  `这是我写给你的一封信! 感谢这一路的伴随 与神同行! 感恩有你! ❤\nHere's a letter from me to you! Thank You for walking with me alongside God in this journey! ❤\n\nhttps://thanksgiving.fgacyc.com/${shareContent} 💌🕊`,
                                )
                                .then(() =>
                                  alert(
                                    "链接已复制成功! 发送给他/她吧!\nLink copied to clipboard! Send this letter to them!",
                                  ),
                                )
                            : navigator.share({
                                text: `这是我写给你的一封信! 🔔\n感谢这一路的伴随 与神同行!🏃🏼🏃🏼‍♀\n感恩有你! ❤\nHere's a letter from me to you! 🔔\nThank You for walking with me alongside God in this journey! 🏃🏼🏃🏼‍♀❤\n\nhttps://thanksgiving.fgacyc.com/${shareContent} 💌🕊`,
                              })
                        }
                      >
                        <span className="font-chi font-bold">分享</span> Share
                      </button>
                      <button
                        className="rounded-2xl border-[1px] border-blue-100 bg-blue-200 px-4 py-1 font-en text-xs text-black/80 lg:px-4 lg:text-base"
                        onClick={() => {
                          setShareContent("");
                          setFile(undefined);
                        }}
                      >
                        <span className="font-chi font-bold">返回</span> Back
                      </button>
                    </div>
                  </div>
                ) : (
                  <Form className="relative flex h-full flex-grow flex-col gap-2 px-2 py-1 text-xs md:px-4 md:py-3 lg:text-base">
                    {isSubmitting && (
                      <div className="absolute inset-0 flex flex-row items-center justify-center bg-white/50">
                        <Oval
                          visible={true}
                          height="50"
                          width="50"
                          ariaLabel="oval-loading"
                          wrapperStyle={{}}
                          wrapperClass=""
                        />
                      </div>
                    )}
                    <div className="flex flex-row gap-2">
                      <label
                        htmlFor="from"
                        className="min-w-[80px] font-en text-black 3xl:w-[145px]"
                      >
                        <span className="font-chi font-bold">来自</span> From
                      </label>
                      <Field
                        className={`${
                          errors.message ? "border-2 border-red-500 " : ""
                        }font-chi w-full font-bold`}
                        name="from"
                        disabled={isSubmitting}
                        id="from"
                      />
                    </div>
                    <div className="flex flex-row gap-x-2">
                      <label
                        htmlFor="to"
                        className="min-w-[80px] font-en text-black 3xl:w-[145px]"
                      >
                        <span className="font-chi font-bold">收信者</span> To
                      </label>
                      <Field
                        className={`${
                          errors.message ? "border-2 border-red-500 " : ""
                        }font-chi w-full font-bold`}
                        name="to"
                        disabled={isSubmitting}
                        id="to"
                      />
                    </div>
                    <div className="flex flex-grow flex-row gap-x-2">
                      <label
                        htmlFor="message"
                        className="min-w-[80px] font-en text-black 3xl:w-[145px]"
                      >
                        <span className="font-chi font-bold">
                          内容
                          <br />
                        </span>{" "}
                        Message
                      </label>
                      <Field
                        className={`${
                          errors.message ? "border-2 border-red-500 " : ""
                        }font-chi flex-grow resize-none font-bold`}
                        name="message"
                        disabled={isSubmitting}
                        id="message"
                        as="textarea"
                      />
                    </div>
                    <div className="flex flex-row gap-x-2">
                      <div className="w-[80px] 3xl:w-[145px]" />
                      <input
                        name={"img"}
                        disabled={isSubmitting}
                        type="file"
                        id="img"
                        onChange={(e) => setFile(e.target.files?.[0])}
                        className={`hidden`}
                        accept="image/png, image/jpeg, image/jpg"
                      />
                      {file ? (
                        <label htmlFor="img">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className="h-[75px] object-cover"
                          />
                        </label>
                      ) : (
                        <label
                          htmlFor="img"
                          className="flex-grow cursor-pointer rounded-full bg-white py-1 text-center font-en text-black"
                        >
                          <span className="font-chi font-bold">添加照片</span>{" "}
                          Add Pictures
                        </label>
                      )}
                    </div>
                    <button
                      disabled={isSubmitting}
                      className="flex flex-row justify-center bg-gradient-to-br from-[#fcfcfc] to-[#f4f5f5] py-1 font-en disabled:opacity-70 3xl:text-lg"
                    >
                      {isSubmitting ? (
                        <Oval
                          visible={true}
                          height="20"
                          width="20"
                          ariaLabel="oval-loading"
                          wrapperStyle={{}}
                          wrapperClass=""
                        />
                      ) : (
                        <>
                          <span className="font-chi font-bold">发送</span> Send
                        </>
                      )}
                    </button>
                  </Form>
                )
              }
            </Formik>
          ) : (
            <div className="relative flex h-full w-full flex-col px-2 py-1 md:px-4 md:py-3">
              <p className="w-full text-center font-chi text-lg">
                嘿，想对你说...
              </p>

              <div
                className={`flex h-[calc(100%-60px)] ${
                  generatingImage ? "flex-col items-center" : "flex-row"
                } gap-x-2 p-1 lg:gap-x-5 lg:p-2`}
              >
                {image && (
                  <img
                    src={`/api/convertImage/${encodeURIComponent(image)}`}
                    className={`${
                      !generatingImage
                        ? "w-[110px] lg:w-[130px]"
                        : "h-[200px] w-full lg:h-[250px]"
                    } object-cover`}
                    alt={"image"}
                  />
                )}
                {!generatingImage && image && (
                  <div className="h-full w-[1px] bg-gray-400" />
                )}
                <div
                  className={`w-full ${
                    generatingImage ? "overflow-hidden" : "overflow-y-scroll"
                  }`}
                >
                  {message?.split("\n").map((m, i) => (
                    <p className="font-chi text-sm lg:text-xl" key={i}>
                      {m}
                    </p>
                  ))}
                </div>
              </div>
              <div className="absolute bottom-2 flex w-full flex-row items-center justify-between pr-5 lg:bottom-3 lg:pr-8">
                <button
                  onClick={async () => {
                    if (generatingImage) return;
                    const id = toast.loading("图片生成中... 📸");
                    setGeneratingImage(true);
                    setTimeout(
                      () =>
                        void toJpeg(document.getElementById("main")!, {
                          quality: 1,
                          // height: 1080,
                          // width: 608,
                        })
                          .then(function (dataUrl: string) {
                            const link = document.createElement("a");
                            const name = `${from}-${to}.jpeg`
                              .replaceAll(" ", "-")
                              .replaceAll("/", "_");
                            link.download = name;
                            link.href = dataUrl;
                            toast.update(id, {
                              render: "图片生成成功! 🎉",
                              type: "success",
                              isLoading: false,
                              autoClose: 2500,
                            });
                            link.click();
                            setGeneratingImage(false);
                          })
                          .catch((err: unknown) => console.log(err)),
                      500,
                    );
                  }}
                  className={`${
                    generatingImage ? "opacity-0 " : ""
                  }flex flex-row items-center gap-1 rounded-2xl border-[1px] border-blue-100 bg-blue-400 bg-opacity-70 px-2 py-1 transition-all duration-300 hover:bg-opacity-100`}
                >
                  <AiOutlineSave className="text-[16px] lg:text-[21px]" />
                  <p className="font-en text-xs text-black">
                    <span className="font-chi font-bold">储存卡片</span> Save
                    Card
                  </p>
                </button>
                <p className="font-en text-xs text-black">
                  <span className="font-chi">来自</span> From: {from}
                </p>
              </div>
            </div>
          )}
        </div>
        <div
          className={`${
            generatingImage ? "opacity-0 " : ""
          }flap left-flap before:-top-[5px] before:h-[300px] before:w-[300px] before:sm:h-[388.90873px] before:sm:w-[388.90873px] before:lg:h-[275px] before:lg:w-[275px] before:3xl:h-[269.27249px] before:3xl:w-[269.27249px]`}
        ></div>
        <div
          className={`${
            generatingImage ? "opacity-0 " : ""
          }flap right-flap before:-top-[5px] before:h-[300px] before:w-[300px] before:sm:h-[388.90873px] before:sm:w-[388.90873px] before:lg:h-[275px] before:lg:w-[275px] before:3xl:h-[269.27249px] before:3xl:w-[269.27249px]`}
        ></div>
        <div
          className={`${
            generatingImage ? "opacity-0 " : ""
          }flap bottom-flap before:h-[470px] before:w-[370px] before:rounded-tl-[25px] before:sm:h-[650px] before:sm:w-[650px] before:lg:h-[800px] before:lg:w-[820px] before:lg:rounded-tl-[50px] before:3xl:h-[388.90873px] before:3xl:w-[388.90873px]`}
        ></div>
        <div
          className={`${
            generatingImage ? "opacity-0 " : ""
          }flap top-flap before:h-[230px] before:w-[230px] before:sm:h-[263.27249px] before:sm:w-[263.27249px] before:lg:h-[318px] before:lg:w-[318px] before:3xl:h-[388.90873px] before:3xl:w-[388.90873px]`}
        ></div>
      </div>
    </div>
  );
};
