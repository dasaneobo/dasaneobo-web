'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import emailjs from '@emailjs/browser';
import Header from '@/components/Header';

// Constants - Use environment variables
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '';
const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '';
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '';

export default function SubscribePage() {
  const router = useRouter();
  const [currentPlan, setCurrentPlan] = useState('연간 구독');
  const [currentAmount, setCurrentAmount] = useState('100,000원/년');
  const [isLoading, setIsLoading] = useState(false);
  const [notice, setNotice] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const [formData, setFormData] = useState({
    subName: '',
    subPhone: '',
    subEmail: '',
    subAddr: '',
    subNote: '',
    subRecommender: '',
    subUnits: 1,
    agreeCheck: false,
  });

  useEffect(() => {
    if (EMAILJS_PUBLIC_KEY && EMAILJS_PUBLIC_KEY !== 'YOUR_EMAILJS_PUBLIC_KEY') {
      emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
    }
  }, []);

  const selectPlan = (plan: string, amount: string) => {
    setCurrentPlan(plan);
    setCurrentAmount(amount);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value, type } = e.target as any;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [id]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData(prev => ({ ...prev, [id]: value }));
    }
  };

  const sendSubscription = async () => {
    const { subName, subPhone, subEmail, subAddr, subNote, subRecommender, subUnits, agreeCheck } = formData;

    if (!subName || !subPhone || !subEmail || !subAddr) {
      setNotice({ msg: '이름, 연락처, 이메일, 배송 주소는 필수 항목입니다.', type: 'error' });
      return;
    }
    if (!agreeCheck) {
      setNotice({ msg: '개인정보 수집·이용에 동의해 주세요.', type: 'error' });
      return;
    }

    // In a real app, you'd show a warning if keys are missing
    if (EMAILJS_PUBLIC_KEY === 'YOUR_EMAILJS_PUBLIC_KEY') {
      console.warn('EmailJS Public Key is not configured.');
    }

    setIsLoading(true);
    setNotice(null);

    const now = new Date();
    const submittedAt =
      now.getFullYear() + '.' +
      String(now.getMonth() + 1).padStart(2, '0') + '.' +
      String(now.getDate()).padStart(2, '0') + ' ' +
      String(now.getHours()).padStart(2, '0') + ':' +
      String(now.getMinutes()).padStart(2, '0');

    const basePrice = parseInt(currentAmount.replace(/[^0-9]/g, '')) || 0;
    const totalPrice = (basePrice * subUnits).toLocaleString() + '원';

    try {
      if (EMAILJS_PUBLIC_KEY !== 'YOUR_EMAILJS_PUBLIC_KEY') {
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
          plan: currentPlan,
          units: subUnits + '구좌',
          amount: totalPrice,
          name: subName,
          phone: subPhone,
          email: subEmail,
          address: subAddr,
          note: subNote || '(없음)',
          recommender: subRecommender || '(없음)',
          submitted_at: submittedAt
        });
      } else {
        // Mock successful response if no key is set for demonstration (optional)
        // For now, let's just try to send it; EmailJS will likely throw an error.
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
          plan: currentPlan,
          units: subUnits + '구좌',
          amount: totalPrice,
          name: subName,
          phone: subPhone,
          email: subEmail,
          address: subAddr,
          note: subNote || '(없음)',
          recommender: subRecommender || '(없음)',
          submitted_at: submittedAt
        });
      }

      const isLifetime = currentPlan === '평생 구독';
      const successMsg = isLifetime
        ? '✓ 창간 후원 신청이 완료되었습니다! 입금 확인 후 명예 독자증과 함께 안내 드리겠습니다. 감사합니다 🙏'
        : '✓ 구독 신청이 완료되었습니다! 입금 확인 후 배송이 시작됩니다. 감사합니다 🙏';
      
      setNotice({
        msg: successMsg,
        type: 'success'
      });

      // Show alert and redirect to home
      alert(successMsg);
      router.push('/');

      setFormData({
        subName: '',
        subPhone: '',
        subEmail: '',
        subAddr: '',
        subNote: '',
        subRecommender: '',
        subUnits: 1,
        agreeCheck: false,
      });
    } catch (err: any) {
      setNotice({
        msg: '전송 실패: EmailJS 설정을 확인해 주세요. (' + (err.text || JSON.stringify(err)) + ')',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isLifetime = currentPlan === '평생 구독';

  return (
    <main>
      <Header />
      <div className="subscription-page">
        <style jsx>{`
          .subscription-page {
            --green:    #4a9c6e;
            --green-d:  #2e7d52;
            --green-l:  #e8f5ee;
            --green-ll: #f4faf7;
            --gold:     #9a7c3a;
            --gold-l:   #fdf8ee;
            --gold-b:   #e8d89a;
            --ink:      #1a1a1a;
            --ink2:     #4a4a4a;
            --ink3:     #888;
            --paper:    #fafaf8;
            --paper2:   #f2f2ef;
            --rule:     #e0e0da;
            --white:    #ffffff;
            --red:      #c0392b;
            
            background: var(--paper);
            color: var(--ink);
            font-family: var(--font-noto-sans-kr), sans-serif;
            padding-bottom: 80px;
          }

          .hero {
            text-align: center;
            padding: 52px 24px 40px;
            border-bottom: 1px solid var(--rule);
          }
          .hero-label {
            display: inline-block;
            font-size: 11px;
            font-weight: 500;
            letter-spacing: .18em;
            color: var(--green);
            border: 1px solid var(--green);
            border-radius: 20px;
            padding: 3px 12px;
            margin-bottom: 16px;
          }
          .hero h1 {
            font-family: var(--font-noto-serif-kr), serif;
            font-size: 28px;
            font-weight: 700;
            line-height: 1.4;
            margin-bottom: 12px;
          }
          .hero p {
            font-size: 15px;
            color: var(--ink2);
            line-height: 1.9;
            max-width: 480px;
            margin: 0 auto;
          }
          .hero-paper-note {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            margin-top: 18px;
            background: var(--green-l);
            border: 1px solid var(--green);
            border-radius: 20px;
            padding: 5px 16px;
            font-size: 13px;
            font-weight: 500;
            color: var(--green-d);
          }

          /* plans */
          .plans-section {
            max-width: 860px;
            margin: 0 auto;
            padding: 48px 20px 0;
          }
          .plans-title {
            font-family: var(--font-noto-serif-kr), serif;
            font-size: 18px;
            font-weight: 600;
            text-align: center;
            margin-bottom: 28px;
          }
          .plans-grid {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 16px;
            align-items: start;
          }

          .plan-card {
            background: var(--white);
            border: 1.5px solid var(--rule);
            border-radius: 12px;
            padding: 28px 22px 24px;
            cursor: pointer;
            transition: border-color .2s, box-shadow .2s, transform .15s;
            position: relative;
            margin-top: 12px;
          }
          .plan-card:hover {
            border-color: var(--green);
            box-shadow: 0 4px 20px rgba(74,156,110,.1);
            transform: translateY(-2px);
          }
          .plan-card.selected {
            border-color: var(--green-d);
            box-shadow: 0 0 0 3px rgba(46,125,82,.12);
          }
          .plan-card.featured { background: var(--green-ll); border-color: var(--green); }
          .plan-card.featured.selected { border-color: var(--green-d); }
          .plan-card.lifetime { background: var(--gold-l); border-color: var(--gold-b); }
          .plan-card.lifetime.selected { border-color: var(--gold); box-shadow: 0 0 0 3px rgba(154,124,58,.12); }
          .plan-card.lifetime:hover { border-color: var(--gold); box-shadow: 0 4px 20px rgba(154,124,58,.1); }

          .plan-badge {
            position: absolute;
            top: -11px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 10px;
            font-weight: 500;
            letter-spacing: .1em;
            padding: 3px 14px;
            border-radius: 20px;
            white-space: nowrap;
            color: #fff;
          }
          .plan-badge.green { background: var(--green-d); }
          .plan-badge.gold  { background: var(--gold); }

          .plan-name {
            font-family: var(--font-noto-serif-kr), serif;
            font-size: 16px;
            font-weight: 600;
            text-align: center;
            margin-bottom: 6px;
          }
          .plan-price-wrap { text-align: center; margin: 14px 0 16px; }
          .plan-price {
            font-size: 30px;
            font-weight: 500;
            color: var(--green-d);
            line-height: 1;
          }
          .plan-card.lifetime .plan-price { color: var(--gold); }
          .plan-price sup { font-size: 14px; vertical-align: super; }
          .plan-period { font-size: 12px; color: var(--ink3); margin-top: 4px; }
          .plan-saving {
            display: inline-block;
            font-size: 11px;
            padding: 2px 8px;
            border-radius: 4px;
            margin-top: 6px;
            font-weight: 500;
          }
          .plan-saving.green { background: var(--green-l); color: var(--green-d); }
          .plan-saving.gold  { background: #f5ecd5; color: var(--gold); }

          .plan-divider { border: none; border-top: 1px solid var(--rule); margin: 16px 0; }

          .plan-features {
            list-style: none;
            font-size: 13px;
            color: var(--ink2);
            line-height: 2.1;
          }
          .plan-features li::before { content: '✓ '; color: var(--green); font-weight: 600; }
          .plan-card.lifetime .plan-features li::before { color: var(--gold); }
          .plan-features li.highlight {
            color: var(--gold);
            font-weight: 500;
          }

          .select-indicator {
            margin-top: 18px;
            width: 100%;
            padding: 9px;
            border-radius: 6px;
            border: 1.5px solid var(--rule);
            background: var(--paper2);
            font-size: 13px;
            color: var(--ink3);
            text-align: center;
            transition: all .2s;
            font-family: var(--font-noto-sans-kr), sans-serif;
            cursor: pointer;
          }
          .plan-card.selected .select-indicator {
            background: var(--green-d);
            border-color: var(--green-d);
            color: #fff;
          }
          .plan-card.lifetime.selected .select-indicator {
            background: var(--gold);
            border-color: var(--gold);
            color: #fff;
          }

          .compare-note {
            max-width: 860px;
            margin: 20px auto 0;
            padding: 0 20px;
            text-align: center;
            font-size: 12px;
            color: var(--ink3);
            line-height: 2;
          }

          /* lifetime perks detail */
          .lifetime-perks {
            max-width: 860px;
            margin: 32px auto 0;
            padding: 0 20px;
          }
          .perks-box {
            background: var(--gold-l);
            border: 1px solid var(--gold-b);
            border-radius: 12px;
            padding: 24px 28px;
          }
          .perks-title {
            font-family: var(--font-noto-serif-kr), serif;
            font-size: 15px;
            font-weight: 600;
            color: var(--gold);
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .perks-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px 24px;
          }
          .perk-item {
            display: flex;
            align-items: flex-start;
            gap: 12px;
            font-size: 13px;
            color: var(--ink2);
            line-height: 1.6;
          }
          .perk-icon {
            font-size: 20px;
            flex-shrink: 0;
            line-height: 1;
            margin-top: 2px;
            filter: drop-shadow(0 2px 4px rgba(154,124,58,0.2));
          }

          /* form */
          .form-section {
            max-width: 560px;
            margin: 48px auto 0;
            padding: 0 20px;
          }
          .form-section-head {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 20px;
          }
          .form-section-head::before,
          .form-section-head::after {
            content: ''; flex: 1; height: 1px; background: var(--rule);
          }
          .form-section-head span {
            font-family: var(--font-noto-serif-kr), serif;
            font-size: 14px; font-weight: 600;
            color: var(--ink2); white-space: nowrap;
          }

          .selected-plan-pill {
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-radius: 8px;
            padding: 12px 16px;
            margin-bottom: 20px;
            border: 1px solid var(--green);
            background: var(--green-l);
            transition: all .2s;
          }
          .selected-plan-pill.gold-pill {
            border-color: var(--gold-b);
            background: var(--gold-l);
          }
          .spp-label { font-size: 12px; color: var(--green-d); }
          .gold-pill .spp-label { color: var(--gold); }
          .spp-value {
            font-size: 15px; font-weight: 500;
            font-family: var(--font-noto-serif-kr), serif;
            color: var(--green-d);
          }
          .selected-plan-pill.gold-pill .spp-value { color: var(--gold); }

          .unit-selector {
            display: flex;
            gap: 8px;
            margin-bottom: 20px;
          }
          .unit-btn {
            flex: 1;
            padding: 10px;
            border: 1px solid var(--rule);
            border-radius: 6px;
            background: var(--white);
            font-size: 14px;
            cursor: pointer;
            transition: all 0.2s;
          }
          .unit-btn.selected {
            background: var(--green-d);
            color: white;
            border-color: var(--green-d);
            font-weight: 600;
          }
          .gold-pill + .unit-selector .unit-btn.selected {
            background: var(--gold);
            border-color: var(--gold);
          }

          .field { margin-bottom: 14px; }
          .field label {
            display: block;
            font-size: 12px; font-weight: 500;
            color: var(--ink2); margin-bottom: 5px;
            letter-spacing: .04em;
          }
          .field label .req { color: var(--red); margin-left: 2px; }
          input[type="text"],
          input[type="email"],
          input[type="tel"],
          textarea {
            font-family: var(--font-noto-sans-kr), sans-serif;
            font-size: 14px; color: var(--ink);
            background: var(--white);
            border: 1px solid var(--rule);
            border-radius: 6px;
            padding: 10px 13px; width: 100%;
            outline: none;
            transition: border-color .15s, box-shadow .15s;
            -webkit-appearance: none;
          }
          input:focus, textarea:focus {
            border-color: var(--green);
            box-shadow: 0 0 0 3px rgba(74,156,110,.1);
          }
          input::placeholder, textarea::placeholder { color: #bbb; }
          textarea { resize: vertical; min-height: 72px; line-height: 1.6; }
          .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }

          .payment-box {
            background: var(--gold-l);
            border: 1px solid var(--gold-b);
            border-radius: 8px;
            padding: 16px 18px;
            margin-bottom: 20px;
            font-size: 13px;
            color: var(--ink2);
            line-height: 1.9;
          }
          .payment-box strong { color: var(--gold); font-size: 14px; }
          .payment-account {
            margin-top: 8px;
            font-size: 15px; font-weight: 500;
            color: var(--ink);
            letter-spacing: .04em;
          }

          .agree-row {
            display: flex;
            align-items: flex-start;
            gap: 8px;
            margin-bottom: 16px;
            font-size: 12px;
            color: var(--ink2);
            line-height: 1.7;
            cursor: pointer;
          }
          .agree-row input[type="checkbox"] {
            width: 15px; height: 15px;
            flex-shrink: 0; margin-top: 2px;
            accent-color: var(--green-d);
            cursor: pointer;
          }

          .submit-btn {
            width: 100%; padding: 15px;
            font-family: var(--font-noto-serif-kr), serif;
            font-size: 16px; font-weight: 600;
            letter-spacing: .08em;
            background: var(--green-d); color: #fff;
            border: none; border-radius: 8px;
            cursor: pointer;
            transition: background .15s, transform .1s;
            display: flex; align-items: center; justify-content: center; gap: 8px;
          }
          .submit-btn:hover { background: #1e6640; }
          .submit-btn:active { transform: scale(.99); }
          .submit-btn:disabled { background: var(--ink3); cursor: not-allowed; transform: none; }
          .submit-btn.gold-btn { background: var(--gold); }
          .submit-btn.gold-btn:hover { background: #7a6028; }

          .spinner {
            width: 16px; height: 16px;
            border: 2px solid rgba(255,255,255,.3);
            border-top-color: #fff; border-radius: 50%;
            animation: spin .7s linear infinite; display: none;
          }
          .submit-btn.loading .spinner { display: block; }
          .submit-btn.loading .btn-text { opacity: .6; }
          @keyframes spin { to { transform: rotate(360deg); } }

          .notice {
            margin-top: 14px; padding: 13px 16px;
            border-radius: 6px; font-size: 13px;
            line-height: 1.6; display: none;
          }
          .notice.show { display: block; }
          .notice.error  { background: #fdf1ef; border-left: 3px solid var(--red); color: #7a1a14; }
          .notice.success{ background: var(--green-l); border-left: 3px solid var(--green-d); color: #1a4a2e; }


          .footer-sub {
            max-width: 860px; margin: 48px auto 0;
            padding: 24px 20px 40px;
            border-top: 1px solid var(--rule);
            text-align: center;
            font-size: 11px; color: var(--ink3); line-height: 2;
          }

          @media (max-width: 620px) {
            .plans-grid { grid-template-columns: 1fr; }
            .perks-grid { grid-template-columns: 1fr; }
            .field-row  { grid-template-columns: 1fr; }
            .hero h1 { font-size: 22px; }
          }
        `}</style>

        <div className="hero">
          <div className="hero-label">SUBSCRIPTION</div>
          <h1>다산어보와 함께해 주세요</h1>
          <p>지역의 진심을 담은 뉴스를 만드는 일,<br />여러분의 구독이 독립 지역 언론을 지킵니다.</p>
          <div className="hero-paper-note">
            종이신문 월 1회 이상 발송 · 온라인 기사 전체 열람
          </div>
        </div>

        {/* plans */}
        <div className="plans-section">
          <div className="plans-title">구독 플랜 선택</div>
          <div className="plans-grid">
            {/* 월간 */}
            <div 
              className={`plan-card ${currentPlan === '월간 구독' ? 'selected' : ''}`} 
              onClick={() => selectPlan('월간 구독', '10,000원/월')}
            >
              <div className="plan-badge green">기본</div>
              <div className="plan-name">월간 구독</div>
              <div className="plan-price-wrap">
                <div className="plan-price"><sup>₩</sup>10,000</div>
                <div className="plan-period">매월 결제</div>
              </div>
              <hr className="plan-divider" />
              <ul className="plan-features">
                <li>종이신문 월 1회 이상 발송 · 온라인 기사 전체 열람</li>
                <li>언제든 해지 가능</li>
              </ul>
              <div className="select-indicator">{currentPlan === '월간 구독' ? '이 플랜 선택 ✓' : '이 플랜 선택'}</div>
            </div>

            {/* 연간 */}
            <div 
              className={`plan-card featured ${currentPlan === '연간 구독' ? 'selected' : ''}`} 
              onClick={() => selectPlan('연간 구독', '100,000원/년')}
            >
              <div className="plan-badge green">가장 인기</div>
              <div className="plan-name">연간 구독</div>
              <div className="plan-price-wrap">
                <div className="plan-price"><sup>₩</sup>100,000</div>
                <div className="plan-period">연 1회 결제</div>
                <div className="plan-saving green">2개월 무료 혜택</div>
              </div>
              <hr className="plan-divider" />
              <ul className="plan-features">
                <li>종이신문 월 1회 이상 발송 · 온라인 기사 전체 열람</li>
                <li>감사 독자 지면 게재</li>
              </ul>
              <div className="select-indicator">{currentPlan === '연간 구독' ? '이 플랜 선택 ✓' : '이 플랜 선택'}</div>
            </div>

            {/* 평생 */}
            <div 
              className={`plan-card lifetime ${currentPlan === '평생 구독' ? 'selected' : ''}`} 
              onClick={() => selectPlan('평생 구독', '1,000,000원 (일시납)')}
            >
              <div className="plan-badge gold">창간 후원</div>
              <div className="plan-name">평생 구독</div>
              <div className="plan-price-wrap">
                <div className="plan-price"><sup>₩</sup>1,000,000</div>
                <div className="plan-period">단 한 번만 결제</div>
                <div className="plan-saving gold">10년 기준 50% 절약</div>
              </div>
              <hr className="plan-divider" />
              <ul className="plan-features">
                <li>종이신문 월 1회 이상 발송 · 온라인 기사 전체 열람</li>
                <li className="highlight">창간 후원인 명단 지면 영구 게재</li>
                <li className="highlight">명예 독자증 실물 발급</li>
                <li className="highlight">지역 특산물 선물박스 (5만원 상당)</li>
                <li className="highlight">배너 또는 지면 광고 무료 게재</li>
                <li className="highlight">다산어보의 날 초청 및 편집진 만남</li>
              </ul>
              <div className="select-indicator">{currentPlan === '평생 구독' ? '이 플랜 선택 ✓' : '이 플랜 선택'}</div>
            </div>
          </div>

          <p className="compare-note">
            모든 플랜에 종이신문 월 1회 이상 우편 배송이 포함됩니다<br />
            평생 구독자는 다산어보를 처음부터 함께 만든 창간 후원인으로 영구 기록됩니다
          </p>
        </div>

        {/* lifetime perks detail */}
        <div className="lifetime-perks">
          <div className="perks-box">
            <div className="perks-title">
              <span style={{fontSize:'16px'}}>★</span> 평생 구독 — 창간 후원인 특별 예우
            </div>
            <div className="perks-grid">
              <div className="perk-item">
                <div className="perk-icon">📜</div>
                <div><strong style={{color:'var(--ink)'}}>창간 후원인 명단 영구 게재</strong><br />신문 지면에 이름이 영원히 남습니다</div>
              </div>
              <div className="perk-item">
                <div className="perk-icon">🪪</div>
                <div><strong style={{color:'var(--ink)'}}>명예 독자증 실물 발급</strong><br />다산어보 공식 명예 독자증을 우편 발송합니다</div>
              </div>
              <div className="perk-item">
                <div className="perk-icon">🎁</div>
                <div><strong style={{color:'var(--ink)'}}>지역 특산물 선물박스</strong><br />강진·고흥·보성·장흥 특산물 5만원 상당을 직접 큐레이션해서 보내드립니다</div>
              </div>
              <div className="perk-item">
                <div className="perk-icon">📢</div>
                <div><strong style={{color:'var(--ink)'}}>광고 무료 게재</strong><br />인터넷 신문 배너 광고 1개월 또는 종이신문 하단 광고 1회 중 선택 가능합니다</div>
              </div>
              <div className="perk-item">
                <div className="perk-icon">🥂</div>
                <div><strong style={{color:'var(--ink)'}}>다산어보의 날 초청</strong><br />연 1회 후원인과 함께하는 특별한 날, 편집진과 직접 만납니다</div>
              </div>
            </div>
          </div>
        </div>

        {/* form */}
        <div className="form-section">
          <div className="form-section-head"><span>구독 신청서</span></div>

          <div className={`selected-plan-pill ${isLifetime ? 'gold-pill' : ''}`}>
            <span className="spp-label">선택하신 플랜</span>
            <span className="spp-value">
              {currentPlan} — {(parseInt(currentAmount.replace(/[^0-9]/g, '')) * formData.subUnits).toLocaleString()}원
              {formData.subUnits > 1 && ` (${formData.subUnits}구좌)`}
            </span>
          </div>

          <div className="field">
            <label>구독 구좌 선택 <span style={{fontSize:'11px', color:'#bbb', fontWeight:300}}>(단위당 금액 적용)</span></label>
            <div className="unit-selector">
              {[1, 2, 3, 4, 5].map((u) => (
                <button 
                  key={u} 
                  type="button"
                  className={`unit-btn ${formData.subUnits === u ? 'selected' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, subUnits: u }))}
                >
                  {u}구좌
                </button>
              ))}
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label>이름 <span className="req">*</span></label>
              <input type="text" id="subName" placeholder="홍길동" value={formData.subName} onChange={handleInputChange} />
            </div>
            <div className="field">
              <label>연락처 <span className="req">*</span></label>
              <input type="tel" id="subPhone" placeholder="010-0000-0000" value={formData.subPhone} onChange={handleInputChange} />
            </div>
          </div>

          <div className="field">
            <label>이메일 <span className="req">*</span></label>
            <input type="email" id="subEmail" placeholder="example@email.com" value={formData.subEmail} onChange={handleInputChange} />
          </div>

          <div className="field">
            <label>신문 배송 주소 <span className="req">*</span></label>
            <input type="text" id="subAddr" placeholder="전라남도 강진군 강진읍 ..." value={formData.subAddr} onChange={handleInputChange} />
          </div>

          <div className="field">
            <label>요청 사항 <span style={{fontSize:'11px', color:'#bbb', fontWeight:300}}>(선택)</span></label>
            <textarea id="subNote" placeholder="배송 관련 메모, 특이사항 등" value={formData.subNote} onChange={handleInputChange}></textarea>
          </div>

          <div className="field">
            <label>추천인 이름 <span style={{fontSize:'11px', color:'#bbb', fontWeight:300}}>(선택)</span></label>
            <input type="text" id="subRecommender" placeholder="추천해주신 분의 이름을 적어주세요" value={formData.subRecommender} onChange={handleInputChange} />
          </div>

          <div className="payment-box">
            <strong>입금 안내</strong><br />
            신청 후 아래 계좌로 구독료를 입금해 주세요.<br />
            입금자명은 <b>신청자 이름</b>으로 해주시면 확인이 빠릅니다.
            <div className="payment-account">농협 000-0000-0000-00 · 다산어보언론협동조합</div>
          </div>

          <label className="agree-row" onClick={(e) => {
             // To prevent double triggering since label wrappers checkbox
             // But here we rely on standard behavior or manual state sync
          }}>
            <input 
              type="checkbox" 
              id="agreeCheck" 
              checked={formData.agreeCheck} 
              onChange={handleInputChange} 
            />
            개인정보(이름·연락처·주소·이메일)를 구독 서비스 제공 목적으로 수집·이용하는 것에 동의합니다. 수집된 정보는 신문 배송 및 구독 관리 외 목적으로 사용되지 않습니다.
          </label>

          <button 
            className={`submit-btn ${isLifetime ? 'gold-btn' : ''} ${isLoading ? 'loading' : ''}`} 
            onClick={sendSubscription} 
            disabled={isLoading}
          >
            <div className="spinner"></div>
            <span className="btn-text">구독 신청하기</span>
          </button>
          
          {notice && (
            <div className={`notice show ${notice.type}`}>
              {notice.msg}
            </div>
          )}
        </div>


        <div className="footer-sub">
          다산어보 언론협동조합 · 전라남도 강진군<br />
          발행인: 강상우 · 편집인: 이득규 · 등록번호: 전남 다00000<br />
          문의: dinoskorea@gmail.com
        </div>
      </div>
    </main>
  );
}
