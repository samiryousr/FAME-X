import { ArrowLeft, Camera, Mail, MessageCircle, Rocket } from "lucide-react";

export default function Contact() {
  return (
    <section className="section contact" id="contact">
      <div className="container contact__container">
        <div className="contact__panel">
          <div className="contact__copy">
            <p className="eyebrow">الخطوة الجاية بتاعتك</p>
            <h2 className="section__title">في دماغك فكرة مشروع؟ يلا نقعد قعدة ونطلّعها للنور!</h2>
            <p className="section__intro">
              احكيلنا فكرتك في كلمتين.. وإحنا هنقولك إزاي نحولها لبيزنس ناجح يبيع ويكبّر مبيعاتك من أول يوم.
            </p>
          </div>
          <div className="contact__channels" id="contact-channels" aria-label="طرق التواصل">
            <div className="contact__channel">
              <span className="contact__channel-icon"><Mail size={19} aria-hidden="true" /></span>
              <span className="contact__channel-copy">
                <strong>ابعتلنا إيميل</strong>
                <span>أضف بريدك هنا</span>
              </span>
            </div>
            <div className="contact__channel">
              <span className="contact__channel-icon"><Camera size={19} aria-hidden="true" /></span>
              <span className="contact__channel-copy">
                <strong>تابعنا ع الإنستجرام</strong>
                <span>أضف رابط حسابك هنا</span>
              </span>
            </div>
            <div className="contact__channel">
              <span className="contact__channel-icon"><MessageCircle size={19} aria-hidden="true" /></span>
              <span className="contact__channel-copy">
                <strong>كلّمنا واتساب دلوقتي</strong>
                <span>أضف رقمك هنا</span>
              </span>
            </div>
          </div>
          <a className="button contact__action" href="#contact-channels">
            <Rocket size={18} aria-hidden="true" />
            <span>يلا بينا نتواصل ونبدأ</span>
            <ArrowLeft size={18} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
