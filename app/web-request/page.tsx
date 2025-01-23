import BrandHeader from '../../components/Header/BrandHeader';

export default function WebRequestPage() {
  return (
    <>
    <BrandHeader />
    <main style={{ padding: "2rem" }}>
      <h1>Webサイト作成のご依頼</h1>
      <p>
        Webサイト制作のご相談・お見積もり依頼は、
        以下のメールアドレスまでお問い合わせください。
      </p>
      <p>
        <a
          href="mailto:shokiishii.me@gmail.com?subject=Webサイト制作のご相談"
          style={{ color: "blue", textDecoration: "underline" }}
        >
          shokiishii.me@gmail.com
        </a>
      </p>
    </main>
    </>
  );
}
