import { useState, useRef, useEffect } from "react";

/* ─── DATA ─────────────────────────────────────────────────────── */
const SKIN_TYPES = ["Normal", "Dry", "Oily", "Combination", "Sensitive"];

const INGREDIENTS_DB = [
  {
    id: "i1",
    type: "ingredient",
    name: "Retinol",
    brand: "La Roche-Posay",
    category: "Anti-aging",
    suitableFor: ["Normal", "Oily", "Combination"],
    avoid: ["Sensitive"],
    study:
      "Clinically proven to increase cell turnover and collagen production (J. Invest. Dermatol, 2016)",
    description:
      "Vitamin A derivative that accelerates skin renewal, reducing fine lines and improving texture.",
    tag: "Gold Standard",
  },
  {
    id: "i2",
    type: "ingredient",
    name: "Niacinamide",
    brand: "CeraVe / Paula's Choice",
    category: "Brightening",
    suitableFor: ["Normal", "Oily", "Combination", "Sensitive", "Dry"],
    avoid: [],
    study:
      "Shown to reduce hyperpigmentation by 35–68% in 4 weeks (Br. J. Dermatol, 2002)",
    description:
      "Multi-functional vitamin B3 that regulates sebum, minimizes pores, and evens skin tone.",
    tag: "Universal",
  },
  {
    id: "i3",
    type: "ingredient",
    name: "Hyaluronic Acid",
    brand: "SkinCeuticals / The Ordinary",
    category: "Hydration",
    suitableFor: ["Normal", "Dry", "Sensitive", "Combination"],
    avoid: [],
    study: "Can hold up to 1000× its weight in water (J. Drugs Dermatol, 2014)",
    description:
      "Powerful humectant that attracts and retains moisture for plump, hydrated skin.",
    tag: "Hydration Hero",
  },
  {
    id: "i4",
    type: "ingredient",
    name: "Salicylic Acid",
    brand: "Paula's Choice / Neutrogena",
    category: "Exfoliation",
    suitableFor: ["Oily", "Combination"],
    avoid: ["Dry", "Sensitive"],
    study:
      "BHA proven to reduce blackheads and acne lesions by 47% (Dermatology, 2004)",
    description:
      "Oil-soluble beta hydroxy acid that penetrates pores to clear congestion and reduce acne.",
    tag: "Acne Fighter",
  },
  {
    id: "i5",
    type: "ingredient",
    name: "Ceramides",
    brand: "CeraVe",
    category: "Barrier Repair",
    suitableFor: ["Dry", "Sensitive", "Normal"],
    avoid: [],
    study:
      "Restores skin barrier integrity, reducing TEWL by up to 30% (Int. J. Cosmet. Sci, 2015)",
    description:
      "Lipid molecules that reinforce the skin barrier, locking in moisture and protecting against irritants.",
    tag: "Barrier Essential",
  },
  {
    id: "i6",
    type: "ingredient",
    name: "Vitamin C",
    brand: "SkinCeuticals C E Ferulic",
    category: "Antioxidant",
    suitableFor: ["Normal", "Dry", "Combination", "Oily"],
    avoid: ["Sensitive"],
    study:
      "Reduces UV-induced oxidative damage and increases collagen synthesis (Nutrients, 2017)",
    description:
      "Potent antioxidant that brightens, protects from environmental damage, and boosts collagen.",
    tag: "Brightening",
  },
  {
    id: "i7",
    type: "ingredient",
    name: "Azelaic Acid",
    brand: "The Ordinary / Paula's Choice",
    category: "Brightening",
    suitableFor: ["Sensitive", "Oily", "Combination", "Normal"],
    avoid: [],
    study:
      "Effectively treats rosacea and PIH; comparable to 4% hydroquinone (Cutis, 2006)",
    description:
      "Gentle acid with antibacterial and brightening properties, safe for sensitive and rosacea-prone skin.",
    tag: "Sensitive Safe",
  },
  {
    id: "i8",
    type: "ingredient",
    name: "Glycolic Acid",
    brand: "Pixi / Paula's Choice",
    category: "Exfoliation",
    suitableFor: ["Normal", "Oily", "Combination"],
    avoid: ["Sensitive", "Dry"],
    study:
      "AHA that improves skin texture and reduces wrinkles by 25% after 3 months (Dermatol. Surg, 1996)",
    description:
      "Alpha hydroxy acid that exfoliates dead skin cells, improving radiance and reducing fine lines.",
    tag: "Resurfacing",
  },
];

const PRODUCTS_DB = [
  {
    id: "p1",
    type: "product",
    name: "Moisturizing Cream",
    brand: "CeraVe",
    skinTypes: ["Dry", "Normal", "Sensitive"],
    ingredient: "Ceramides",
    price: "$16",
    rating: 4.7,
    description:
      "Rich, non-greasy moisturizer with three essential ceramides and hyaluronic acid. Fragrance-free and non-comedogenic.",
    emoji: "🫙",
  },
  {
    id: "p2",
    type: "product",
    name: "2% BHA Liquid Exfoliant",
    brand: "Paula's Choice",
    skinTypes: ["Oily", "Combination"],
    ingredient: "Salicylic Acid",
    price: "$34",
    rating: 4.8,
    description:
      "Leave-on exfoliant that unclogs pores, smooths skin, and visibly reduces blackheads.",
    emoji: "💧",
  },
  {
    id: "p3",
    type: "product",
    name: "Retinol B3 Serum",
    brand: "La Roche-Posay",
    skinTypes: ["Normal", "Oily"],
    ingredient: "Retinol",
    price: "$40",
    rating: 4.6,
    description:
      "Gradual-release retinol serum with vitamin B3, designed to minimize irritation while improving texture.",
    emoji: "✨",
  },
  {
    id: "p4",
    type: "product",
    name: "C E Ferulic Serum",
    brand: "SkinCeuticals",
    skinTypes: ["Normal", "Dry", "Combination"],
    ingredient: "Vitamin C",
    price: "$182",
    rating: 4.9,
    description:
      "The gold-standard vitamin C serum. Synergistic antioxidant formula proven to neutralize free radical damage.",
    emoji: "🌟",
  },
  {
    id: "p5",
    type: "product",
    name: "Niacinamide 10% + Zinc",
    brand: "The Ordinary",
    skinTypes: ["Oily", "Combination", "Normal"],
    ingredient: "Niacinamide",
    price: "$6",
    rating: 4.5,
    description:
      "High-strength niacinamide serum targeting blemishes, enlarged pores, and uneven tone.",
    emoji: "🧪",
  },
  {
    id: "p6",
    type: "product",
    name: "Hydro Boost Water Gel",
    brand: "Neutrogena",
    skinTypes: ["Dry", "Normal", "Sensitive"],
    ingredient: "Hyaluronic Acid",
    price: "$22",
    rating: 4.6,
    description:
      "Water gel moisturizer with hyaluronic acid that quenches dry skin and keeps it hydrated all day.",
    emoji: "💦",
  },
  {
    id: "p7",
    type: "product",
    name: "Glow Tonic",
    brand: "Pixi",
    skinTypes: ["Normal", "Oily", "Combination"],
    ingredient: "Glycolic Acid",
    price: "$29",
    rating: 4.4,
    description:
      "5% glycolic acid toner that gently exfoliates, visibly brightens, and refines skin texture.",
    emoji: "🌸",
  },
  {
    id: "p8",
    type: "product",
    name: "Azelaic Acid Suspension 10%",
    brand: "The Inkey List",
    skinTypes: ["Sensitive", "Oily", "Normal"],
    ingredient: "Azelaic Acid",
    price: "$14",
    rating: 4.3,
    description:
      "10% azelaic acid serum that reduces redness, evens tone, and is safe for rosacea-prone skin.",
    emoji: "🌿",
  },
];

const ANALYSIS_RESULTS = {
  Normal: {
    concerns: ["Minor dehydration", "Early signs of aging"],
    characteristics: ["Balanced sebum", "Small pores", "Even tone"],
    score: 82,
    color: "#7BAF7B",
  },
  Dry: {
    concerns: ["Dehydration", "Flakiness", "Tight feeling"],
    characteristics: [
      "Low oil production",
      "Visible dry patches",
      "Dull appearance",
    ],
    score: 65,
    color: "#D4956A",
  },
  Oily: {
    concerns: ["Excess sebum", "Enlarged pores", "Breakouts"],
    characteristics: ["Shiny T-zone", "Large pores", "Frequent congestion"],
    score: 71,
    color: "#A8BF8A",
  },
  Combination: {
    concerns: ["Uneven texture", "T-zone congestion", "Dry cheeks"],
    characteristics: [
      "Mixed oil zones",
      "Visible pores on nose",
      "Varied hydration",
    ],
    score: 74,
    color: "#B89BC8",
  },
  Sensitive: {
    concerns: ["Redness", "Reactivity", "Barrier damage"],
    characteristics: [
      "Easily irritated",
      "Redness-prone",
      "Reactive to fragrance",
    ],
    score: 60,
    color: "#D4878A",
  },
};

const CONCERN_KEYWORDS = {
  acne: { ingredients: ["i4", "i2"], products: ["p2", "p5"] },
  oily: { ingredients: ["i4", "i8"], products: ["p2", "p7"] },
  dry: { ingredients: ["i3", "i5"], products: ["p6", "p1"] },
  dehydrated: { ingredients: ["i3"], products: ["p6"] },
  sensitive: { ingredients: ["i7", "i5", "i2"], products: ["p8", "p1"] },
  redness: { ingredients: ["i7"], products: ["p8"] },
  aging: { ingredients: ["i1", "i6"], products: ["p3", "p4"] },
  wrinkles: { ingredients: ["i1"], products: ["p3"] },
  brightening: {
    ingredients: ["i6", "i2", "i7"],
    products: ["p4", "p5", "p8"],
  },
  dull: { ingredients: ["i6", "i8"], products: ["p4", "p7"] },
  pores: { ingredients: ["i4", "i2"], products: ["p2", "p5"] },
  hyperpigmentation: {
    ingredients: ["i2", "i6", "i7"],
    products: ["p5", "p4", "p8"],
  },
  texture: { ingredients: ["i8", "i4"], products: ["p7", "p2"] },
  barrier: { ingredients: ["i5", "i3"], products: ["p1", "p6"] },
};

const CONCERN_RESPONSES = {
  acne: "For acne-prone skin, I focus on ingredients that unclog pores and balance oil. Here's what I recommend:",
  oily: "Oily skin thrives with lightweight, pore-clearing ingredients. Here are my top picks:",
  dry: "Dry skin needs deep hydration and barrier repair. These are my go-tos:",
  dehydrated:
    "Dehydrated skin craves moisture-binding ingredients. Check these out:",
  sensitive:
    "For sensitive skin, we go gentle and evidence-backed. Here's what's safe and effective:",
  redness:
    "To calm redness, these ingredients are clinically proven to soothe inflammation:",
  aging:
    "For anti-aging, the evidence points clearly to a few key ingredients:",
  wrinkles:
    "To target wrinkles, retinoids are the gold standard. Here's what I'd recommend:",
  brightening:
    "For a brighter complexion, these ingredients have solid clinical backing:",
  dull: "Dull skin usually needs exfoliation and antioxidants. These will help:",
  pores:
    "To minimize pores, these ingredients will make the biggest difference:",
  hyperpigmentation:
    "For hyperpigmentation, these are the most effective, evidence-backed options:",
  texture: "To smooth uneven texture, exfoliating acids are your best friend:",
  barrier:
    "A damaged skin barrier needs lipids and gentle humectants. These are ideal:",
};

function generateBotReply(input, skinType, hasPhoto) {
  const lower = (input || "").toLowerCase();
  if (hasPhoto) {
    const detected = SKIN_TYPES[Math.floor(Math.random() * SKIN_TYPES.length)];
    return {
      detectedType: detected,
      text: `I've analyzed your skin photo! ✨ Your skin appears to be **${detected}** type. Here are my personalized picks for you:`,
      cards: [
        ...INGREDIENTS_DB.filter((i) => i.suitableFor.includes(detected)).slice(
          0,
          1
        ),
        ...PRODUCTS_DB.filter((p) => p.skinTypes.includes(detected)).slice(
          0,
          2
        ),
      ],
      followUp: `Want me to build you a complete routine for ${detected} skin, or dive deeper into any of these?`,
    };
  }
  if (/^(hi|hello|hey|sup|yo)\b/.test(lower))
    return {
      text: "Hello, gorgeous! 🌸 I'm Sora, your personal skincare guide. Tell me about your skin — concerns, questions, or send me a photo for an instant analysis!",
      cards: [],
    };
  const ingMatch = INGREDIENTS_DB.find((i) =>
    lower.includes(i.name.toLowerCase())
  );
  if (
    ingMatch &&
    (lower.includes("what") ||
      lower.includes("explain") ||
      lower.includes("tell me") ||
      lower.includes("about"))
  )
    return {
      text: `Here's everything you need to know about **${ingMatch.name}**:`,
      cards: [ingMatch],
      followUp: `${ingMatch.description} Clinically backed — ${ingMatch.study}. Want product recommendations containing this ingredient?`,
    };
  const prodMatch = PRODUCTS_DB.find(
    (p) =>
      lower.includes(p.name.toLowerCase()) ||
      lower.includes(p.brand.toLowerCase())
  );
  if (prodMatch)
    return {
      text: `Here's the full scoop on **${prodMatch.name}**:`,
      cards: [prodMatch],
      followUp: `One of my top picks for ${prodMatch.skinTypes.join(
        ", "
      )} skin. Want to see similar alternatives?`,
    };
  let mk = Object.keys(CONCERN_KEYWORDS).filter((k) => lower.includes(k));
  if (lower.includes("oily") && !mk.includes("oily")) mk.push("oily");
  if (lower.includes("dry") && !mk.includes("dry")) mk.push("dry");
  if (lower.includes("sensitive") && !mk.includes("sensitive"))
    mk.push("sensitive");
  if (mk.length > 0) {
    const ids = [
      ...new Set(mk.flatMap((k) => CONCERN_KEYWORDS[k].ingredients)),
    ].slice(0, 2);
    const pids = [
      ...new Set(mk.flatMap((k) => CONCERN_KEYWORDS[k].products)),
    ].slice(0, 2);
    return {
      text:
        CONCERN_RESPONSES[mk[0]] ||
        "Based on your concern, here's what I'd recommend:",
      cards: [
        ...ids.map((id) => INGREDIENTS_DB.find((i) => i.id === id)),
        ...pids.map((id) => PRODUCTS_DB.find((p) => p.id === id)),
      ].filter(Boolean),
    };
  }
  if (
    skinType &&
    (lower.includes("recommend") ||
      lower.includes("suggest") ||
      lower.includes("what should"))
  )
    return {
      text: `Based on your **${skinType}** skin type, here are my top picks for you:`,
      cards: PRODUCTS_DB.filter((p) => p.skinTypes.includes(skinType)).slice(
        0,
        3
      ),
      followUp:
        "Want to target a specific concern, or shall I build a full routine?",
    };
  return {
    text: "I'm here to help! Try asking me:\n• About a skin concern (acne, dryness, aging, redness)\n• About a specific ingredient or brand\n• Or send me a photo of your skin and I'll analyze it 📸",
    cards: [],
  };
}

const EMOJIS = [
  "📁",
  "⭐",
  "💧",
  "🌿",
  "✨",
  "🌸",
  "🧴",
  "🔬",
  "💊",
  "🌙",
  "☀️",
  "❤️",
  "💪",
  "🎯",
];
const ROUTINE_STEPS = [
  "Cleanser",
  "Toner",
  "Serum",
  "Moisturizer",
  "SPF",
  "Eye Cream",
  "Facial Oil",
  "Exfoliant",
];

export default function HadaPod() {
  // ── Auth state ──
  const [authScreen, setAuthScreen] = useState("landing"); // landing | login | signup | onboarding
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [authForm, setAuthForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [onboardStep, setOnboardStep] = useState(0);
  const [onboardAnswers, setOnboardAnswers] = useState({
    skinConcerns: [],
    skinType: "",
    skinGoals: [],
  });
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [activeTab, setActiveTab] = useState("home");
  const [skinType, setSkinType] = useState(null);
  const [messages, setMessages] = useState([
    {
      id: 1,
      from: "bot",
      text: "Hello, gorgeous! 🌸 I'm **Sora**, your personal skincare guide from HadaPod. Tell me about your skin concerns, ask about any ingredient, or send me a photo for an instant analysis!",
      cards: [],
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chatPhotoPreview, setChatPhotoPreview] = useState(null);
  const chatEndRef = useRef();
  const chatFileRef = useRef();
  const [analysisStage, setAnalysisStage] = useState("idle");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState(null);
  const analysisFileRef = useRef();
  const [photoSlots, setPhotoSlots] = useState({
    forehead: null,
    leftCheek: null,
    rightCheek: null,
    nose: null,
    chin: null,
  });
  const [activeSlot, setActiveSlot] = useState(null);
  const slotFileRef = useRef();
  const [collections, setCollections] = useState([
    { id: "c1", name: "My Favourites", emoji: "⭐", items: [] },
    { id: "c2", name: "Morning Routine", emoji: "☀️", items: [] },
    { id: "c3", name: "Evening Routine", emoji: "🌙", items: [] },
  ]);
  const [showAddToCollection, setShowAddToCollection] = useState(null);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderEmoji, setNewFolderEmoji] = useState("📁");
  const [activeCollection, setActiveCollection] = useState(null);
  const [starredItems, setStarredItems] = useState({});
  const [notification, setNotification] = useState(null);
  const [routine, setRoutine] = useState({ AM: {}, PM: {} });
  const [routineTime, setRoutineTime] = useState("AM");
  const [completedSteps, setCompletedSteps] = useState({ AM: {}, PM: {} });

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const showNotif = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2500);
  };

  // ── Auth helpers ──
  const handleGoogleLogin = () => {
    setAuthLoading(true);
    setTimeout(() => {
      setAuthLoading(false);
      setCurrentUser({
        name: "Alex Johnson",
        email: "alex@gmail.com",
        avatar: "AJ",
        provider: "google",
      });
      setIsLoggedIn(true);
      setAuthScreen("onboarding");
    }, 1400);
  };

  const handleEmailSignup = () => {
    setAuthError("");
    if (!authForm.name.trim()) return setAuthError("Please enter your name.");
    if (!authForm.email.includes("@"))
      return setAuthError("Please enter a valid email.");
    if (authForm.password.length < 6)
      return setAuthError("Password must be at least 6 characters.");
    if (authForm.password !== authForm.confirmPassword)
      return setAuthError("Passwords don't match.");
    setAuthLoading(true);
    setTimeout(() => {
      setAuthLoading(false);
      setCurrentUser({
        name: authForm.name,
        email: authForm.email,
        avatar: authForm.name
          .split(" ")
          .map((w) => w[0])
          .join("")
          .toUpperCase()
          .slice(0, 2),
        provider: "email",
      });
      setIsLoggedIn(true);
      setAuthScreen("onboarding");
    }, 1200);
  };

  const handleEmailLogin = () => {
    setAuthError("");
    if (!authForm.email.includes("@"))
      return setAuthError("Please enter a valid email.");
    if (!authForm.password) return setAuthError("Please enter your password.");
    setAuthLoading(true);
    setTimeout(() => {
      setAuthLoading(false);
      setCurrentUser({
        name: "Welcome back!",
        email: authForm.email,
        avatar: authForm.email[0].toUpperCase(),
        provider: "email",
      });
      setIsLoggedIn(true);
      setActiveTab("home");
    }, 1200);
  };

  const finishOnboarding = () => {
    if (onboardAnswers.skinType) setSkinType(onboardAnswers.skinType);
    setAuthScreen("app");
    setActiveTab("home");
  };

  const sendMessage = (overrideText, overridePhoto) => {
    const text = overrideText !== undefined ? overrideText : chatInput.trim();
    const photo =
      overridePhoto !== undefined ? overridePhoto : chatPhotoPreview;
    if (!text && !photo) return;
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), from: "user", text: text || "", photo, cards: [] },
    ]);
    setChatInput("");
    setChatPhotoPreview(null);
    setIsTyping(true);
    setTimeout(() => {
      const reply = generateBotReply(text, skinType, !!photo);
      if (reply.detectedType && !skinType) setSkinType(reply.detectedType);
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, from: "bot", ...reply },
      ]);
    }, 900 + Math.random() * 500);
  };

  const handleChatPhoto = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setChatPhotoPreview(URL.createObjectURL(f));
    e.target.value = "";
  };

  const runAnalysis = (manual) => {
    setAnalysisStage("analyzing");
    setAnalysisProgress(0);
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 18 + 5;
      if (p >= 100) {
        p = 100;
        clearInterval(iv);
        setTimeout(() => {
          const d =
            manual || SKIN_TYPES[Math.floor(Math.random() * SKIN_TYPES.length)];
          setSkinType(d);
          setAnalysisResult(d);
          setAnalysisStage("done");
        }, 350);
      }
      setAnalysisProgress(Math.min(p, 100));
    }, 220);
  };

  const handleAnalysisUpload = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setUploadedImage(URL.createObjectURL(f));
    runAnalysis(null);
  };

  const handleSlotUpload = (e) => {
    const f = e.target.files[0];
    if (!f || !activeSlot) return;
    const url = URL.createObjectURL(f);
    setPhotoSlots((prev) => ({ ...prev, [activeSlot]: url }));
    setUploadedImage(url);
    e.target.value = "";
  };

  const photosUploaded = Object.values(photoSlots).filter(Boolean).length;

  const resetAnalysis = () => {
    setUploadedImage(null);
    setAnalysisStage("idle");
    setAnalysisResult(null);
    setPhotoSlots({
      forehead: null,
      leftCheek: null,
      rightCheek: null,
      nose: null,
      chin: null,
    });
  };

  const toggleStar = (item) => {
    const was = starredItems[item.id];
    setStarredItems((prev) => ({ ...prev, [item.id]: !prev[item.id] }));
    if (!was) setShowAddToCollection(item);
  };
  const addToCollection = (cid, item) => {
    setCollections((prev) =>
      prev.map((c) =>
        c.id !== cid
          ? c
          : c.items.find((i) => i.id === item.id)
          ? c
          : { ...c, items: [...c.items, item] }
      )
    );
    setShowAddToCollection(null);
    showNotif("Saved to collection ✓");
  };
  const removeFromCollection = (cid, iid) =>
    setCollections((prev) =>
      prev.map((c) =>
        c.id === cid ? { ...c, items: c.items.filter((i) => i.id !== iid) } : c
      )
    );
  const createFolder = () => {
    if (!newFolderName.trim()) return;
    setCollections((prev) => [
      ...prev,
      {
        id: `c${Date.now()}`,
        name: newFolderName.trim(),
        emoji: newFolderEmoji,
        items: [],
      },
    ]);
    setNewFolderName("");
    setShowCreateFolder(false);
    showNotif("Collection created ✓");
  };

  const BoldText = ({ text }) =>
    (text || "")
      .split(/(\*\*[^*]+\*\*)/)
      .map((p, i) =>
        p.startsWith("**") ? (
          <strong key={i}>{p.slice(2, -2)}</strong>
        ) : (
          <span key={i}>{p}</span>
        )
      );

  const analysisData = analysisResult ? ANALYSIS_RESULTS[analysisResult] : null;

  /* ── Item Card ── */
  const ItemCard = ({ item }) => {
    const starred = starredItems[item.id];
    const isProduct = item.type === "product";
    const tagColors = {
      "Gold Standard": "#C9A84C",
      Universal: "#7BAF7B",
      "Hydration Hero": "#6FA3C4",
      "Acne Fighter": "#C47B6F",
      "Barrier Essential": "#B89BC8",
      Brightening: "#D4956A",
      "Sensitive Safe": "#D4878A",
      Resurfacing: "#8A9BC4",
    };
    return (
      <div
        style={{
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(212,185,160,0.3)",
          borderRadius: 20,
          padding: "18px 16px",
          width: 220,
          flexShrink: 0,
          boxShadow: "0 8px 32px rgba(180,140,110,0.12)",
          position: "relative",
          transition: "transform 0.2s, box-shadow 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-4px)";
          e.currentTarget.style.boxShadow = "0 16px 48px rgba(180,140,110,0.2)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 8px 32px rgba(180,140,110,0.12)";
        }}
      >
        {isProduct && (
          <div style={{ fontSize: 32, marginBottom: 10, textAlign: "center" }}>
            {item.emoji}
          </div>
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 6,
          }}
        >
          <span
            style={{
              fontSize: 8,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              padding: "3px 8px",
              borderRadius: 20,
              fontFamily: "'Jost',sans-serif",
              fontWeight: 600,
              background: tagColors[item.tag] || "#D4B896" + "22",
              color: tagColors[item.tag] || "#8A7060",
              border: `1px solid ${tagColors[item.tag] || "#D4B896"}44`,
            }}
          >
            {isProduct ? item.ingredient : item.tag}
          </span>
          <button
            onClick={() => toggleStar(item)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 18,
              color: starred ? "#E8B84B" : "#D4C4B0",
              transition: "all 0.2s",
              padding: 0,
              lineHeight: 1,
              transform: starred ? "scale(1.25)" : "scale(1)",
            }}
          >
            ★
          </button>
        </div>
        <div
          style={{
            fontFamily: "'Cormorant Garamond',serif",
            fontSize: 15,
            fontWeight: 700,
            marginBottom: 2,
            lineHeight: 1.3,
            color: "#2A2018",
          }}
        >
          {item.name}
        </div>
        <div
          style={{
            fontSize: 10,
            color: "#A09080",
            marginBottom: 8,
            fontFamily: "'Jost',sans-serif",
            letterSpacing: "0.05em",
          }}
        >
          {item.brand}
        </div>
        <div
          style={{
            fontSize: 11,
            color: "#6A5A4A",
            lineHeight: 1.6,
            marginBottom: 10,
            fontFamily: "'Jost',sans-serif",
          }}
        >
          {item.description?.slice(0, 80)}...
        </div>
        {isProduct && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderTop: "1px solid rgba(212,185,160,0.3)",
              paddingTop: 10,
            }}
          >
            <span
              style={{
                fontFamily: "'Cormorant Garamond',serif",
                fontWeight: 700,
                fontSize: 16,
                color: "#2A2018",
              }}
            >
              {item.price}
            </span>
            <div style={{ display: "flex", gap: 2 }}>
              {[1, 2, 3, 4, 5].map((s) => (
                <span
                  key={s}
                  style={{
                    color: s <= Math.round(item.rating) ? "#E8B84B" : "#E0D5C8",
                    fontSize: 11,
                  }}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const tabs = [
    { id: "home", label: "Home", icon: "⌂" },
    { id: "chat", label: "Chat with Sora", icon: "✦" },
    { id: "analyze", label: "Skin Analysis", icon: "◎" },
    { id: "profile", label: "My Profile", icon: "◈" },
    { id: "routine", label: "My Routine", icon: "◷" },
  ];

  // ── Shared style tokens ──
  const BG =
    "linear-gradient(145deg,#FBF7F2 0%,#F5EDE4 40%,#F0E8E2 70%,#EDE4DC 100%)";
  const ROSE = "linear-gradient(135deg,#C8877A,#D4956A)";
  const GLASS = {
    background: "rgba(255,255,255,0.78)",
    backdropFilter: "blur(22px)",
    border: "1px solid rgba(212,184,150,0.32)",
    borderRadius: 26,
    boxShadow: "0 20px 64px rgba(160,110,80,0.14)",
  };
  const INPUT = {
    width: "100%",
    padding: "13px 18px",
    border: "1.5px solid rgba(212,184,150,0.4)",
    borderRadius: 14,
    fontSize: 14,
    fontFamily: "'Jost',sans-serif",
    background: "rgba(255,255,255,0.7)",
    color: "#2A2018",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
  };
  const LABEL = {
    fontSize: 11,
    letterSpacing: "0.11em",
    textTransform: "uppercase",
    color: "#B8A090",
    fontFamily: "'Jost',sans-serif",
    fontWeight: 600,
    display: "block",
    marginBottom: 7,
  };

  const SHARED_STYLE = `
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Jost:wght@300;400;500;600&display=swap');
    *{box-sizing:border-box;margin:0;padding:0}
    .fade-in{animation:fi 0.45s cubic-bezier(0.22,1,0.36,1)}
    @keyframes fi{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
    .slide-up{animation:su 0.5s cubic-bezier(0.22,1,0.36,1)}
    @keyframes su{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
    .float{animation:fl 4s ease-in-out infinite}
    @keyframes fl{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
    .pulse{animation:pu 2.4s ease-in-out infinite}
    @keyframes pu{0%,100%{opacity:0.18;transform:scale(1)}50%{opacity:0.08;transform:scale(1.1)}}
    input:focus{border-color:rgba(200,135,122,0.65)!important;box-shadow:0 0 0 3px rgba(200,135,122,0.1)!important}
    .btn-hover:hover{transform:translateY(-2px);box-shadow:0 10px 32px rgba(200,135,122,0.5)!important}
    .opt-card{transition:all 0.2s cubic-bezier(0.22,1,0.36,1);cursor:pointer}
    .opt-card:hover{transform:translateY(-2px)}
    .goog-btn:hover{box-shadow:0 6px 24px rgba(160,110,80,0.18)!important}
  `;

  // Google SVG logo
  const GoogleLogo = () => (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );

  const AuthError = ({ msg }) =>
    msg ? (
      <div
        style={{
          background: "rgba(200,80,70,0.07)",
          border: "1px solid rgba(200,80,70,0.22)",
          borderRadius: 12,
          padding: "11px 16px",
          marginBottom: 18,
          fontSize: 13,
          color: "#B83020",
          fontFamily: "'Jost',sans-serif",
          display: "flex",
          gap: 8,
          alignItems: "center",
        }}
      >
        <span>⚠</span>
        {msg}
      </div>
    ) : null;

  // ════════════ LANDING ════════════
  if (!isLoggedIn && authScreen === "landing")
    return (
      <div
        style={{
          minHeight: "100vh",
          background: BG,
          fontFamily: "'Jost',sans-serif",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <style>{SHARED_STYLE}</style>

        {/* Decorative orbs */}
        <div
          className="pulse"
          style={{
            position: "fixed",
            top: -120,
            right: -120,
            width: 480,
            height: 480,
            borderRadius: "50%",
            background: "rgba(200,135,122,0.12)",
            pointerEvents: "none",
          }}
        />
        <div
          className="pulse"
          style={{
            position: "fixed",
            bottom: -80,
            left: -80,
            width: 320,
            height: 320,
            borderRadius: "50%",
            background: "rgba(212,184,150,0.14)",
            pointerEvents: "none",
            animationDelay: "1.2s",
          }}
        />

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "60px 28px 48px",
            textAlign: "center",
            position: "relative",
            zIndex: 1,
            maxWidth: 520,
            width: "100%",
          }}
        >
          {/* Floating logo */}
          <div
            className="float"
            style={{ marginBottom: 36, position: "relative" }}
          >
            <div
              style={{
                position: "absolute",
                inset: -20,
                borderRadius: "50%",
                background: "rgba(200,135,122,0.1)",
                animation: "pu 2.4s ease-in-out infinite",
              }}
            />
            <div
              style={{
                width: 108,
                height: 108,
                background: "linear-gradient(135deg,#EEC8C0,#F4DDD0)",
                borderRadius: 30,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 58,
                boxShadow: "0 16px 56px rgba(200,135,122,0.32)",
                position: "relative",
                zIndex: 1,
              }}
            >
              🌸
            </div>
          </div>

          <div
            className="fade-in"
            style={{
              fontFamily: "'Cormorant Garamond',serif",
              fontSize: 58,
              fontWeight: 700,
              color: "#2A2018",
              lineHeight: 1,
              marginBottom: 10,
              letterSpacing: "-0.01em",
            }}
          >
            Hada<em style={{ color: "#C8877A", fontStyle: "normal" }}>Pod</em>
          </div>
          <div
            className="fade-in"
            style={{
              fontSize: 10,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: "#C8BFB5",
              marginBottom: 24,
              fontFamily: "'Jost',sans-serif",
            }}
          >
            Evidence-Based Skincare Intelligence
          </div>

          <div
            className="fade-in"
            style={{
              fontSize: 18,
              color: "#6A5A4A",
              lineHeight: 1.75,
              maxWidth: 380,
              marginBottom: 44,
              fontWeight: 300,
              fontFamily: "'Cormorant Garamond',serif",
              fontStyle: "italic",
            }}
          >
            Your personal AI skincare advisor, ingredient expert, and daily
            routine companion.
          </div>

          {/* Feature pills */}
          <div
            className="fade-in"
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
              justifyContent: "center",
              marginBottom: 48,
            }}
          >
            {[
              "🔬 AI Skin Analysis",
              "🌸 Chat with Sora",
              "⭐ Save Collections",
              "☀️ Routine Tracker",
            ].map((f) => (
              <span
                key={f}
                style={{
                  padding: "9px 18px",
                  background: "rgba(255,255,255,0.65)",
                  border: "1px solid rgba(212,184,150,0.38)",
                  borderRadius: 24,
                  fontSize: 12,
                  color: "#7A6052",
                  backdropFilter: "blur(8px)",
                }}
              >
                {f}
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div
            className="fade-in"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              width: "100%",
              maxWidth: 360,
            }}
          >
            <button
              className="btn-hover"
              onClick={() => setAuthScreen("signup")}
              style={{
                padding: "16px",
                background: ROSE,
                color: "#fff",
                border: "none",
                borderRadius: 16,
                cursor: "pointer",
                fontSize: 15,
                fontFamily: "'Jost',sans-serif",
                fontWeight: 600,
                letterSpacing: "0.05em",
                boxShadow: "0 6px 28px rgba(200,135,122,0.42)",
                transition: "all 0.2s",
              }}
            >
              Get Started — It's Free
            </button>
            <button
              onClick={() => setAuthScreen("login")}
              style={{
                padding: "16px",
                background: "rgba(255,255,255,0.58)",
                color: "#8A7060",
                border: "1.5px solid rgba(212,184,150,0.48)",
                borderRadius: 16,
                cursor: "pointer",
                fontSize: 15,
                fontFamily: "'Jost',sans-serif",
                fontWeight: 500,
                backdropFilter: "blur(10px)",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.84)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.58)")
              }
            >
              I already have an account
            </button>
          </div>
        </div>

        <div
          style={{
            padding: "0 28px 32px",
            fontSize: 11,
            color: "#C8BFB5",
            fontFamily: "'Jost',sans-serif",
            textAlign: "center",
          }}
        >
          🔒 Your skin data stays private. We never sell or share your
          information.
        </div>
      </div>
    );

  // ════════════ LOGIN ════════════
  if (!isLoggedIn && authScreen === "login")
    return (
      <div
        style={{
          minHeight: "100vh",
          background: BG,
          fontFamily: "'Jost',sans-serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <style>{SHARED_STYLE}</style>
        <div
          className="pulse"
          style={{
            position: "fixed",
            top: -100,
            right: -100,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "rgba(200,135,122,0.1)",
            pointerEvents: "none",
          }}
        />

        <div
          className="fade-in"
          style={{
            ...GLASS,
            padding: "44px 40px",
            width: "100%",
            maxWidth: 440,
            position: "relative",
            zIndex: 1,
          }}
        >
          <button
            onClick={() => setAuthScreen("landing")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 13,
              color: "#B8A090",
              fontFamily: "'Jost',sans-serif",
              marginBottom: 30,
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: 0,
            }}
          >
            ← Back
          </button>

          {/* Logo header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 13,
              marginBottom: 34,
            }}
          >
            <div
              style={{
                width: 46,
                height: 46,
                background: "linear-gradient(135deg,#EEC8C0,#F4DDD0)",
                borderRadius: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
                boxShadow: "0 4px 16px rgba(200,135,122,0.22)",
              }}
            >
              🌸
            </div>
            <div>
              <div
                style={{
                  fontFamily: "'Cormorant Garamond',serif",
                  fontSize: 23,
                  fontWeight: 700,
                  color: "#2A2018",
                  lineHeight: 1.1,
                }}
              >
                Welcome back
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "#B8A090",
                  fontFamily: "'Jost',sans-serif",
                  marginTop: 2,
                }}
              >
                Sign in to your HadaPod account
              </div>
            </div>
          </div>

          {/* Google */}
          <button
            className="goog-btn"
            onClick={handleGoogleLogin}
            disabled={authLoading}
            style={{
              width: "100%",
              padding: "14px",
              background: "#fff",
              border: "1.5px solid rgba(212,184,150,0.45)",
              borderRadius: 14,
              cursor: "pointer",
              fontSize: 14,
              fontFamily: "'Jost',sans-serif",
              fontWeight: 500,
              color: "#3A2A1A",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              marginBottom: 22,
              boxShadow: "0 2px 12px rgba(160,110,80,0.07)",
              transition: "all 0.2s",
            }}
          >
            {authLoading ? <span>⏳</span> : <GoogleLogo />}
            {authLoading ? "Signing in..." : "Continue with Google"}
          </button>

          {/* Divider */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              marginBottom: 22,
            }}
          >
            <div
              style={{
                flex: 1,
                height: 1,
                background: "rgba(212,184,150,0.28)",
              }}
            />
            <span
              style={{
                fontSize: 11,
                color: "#C8BFB5",
                fontFamily: "'Jost',sans-serif",
                whiteSpace: "nowrap",
              }}
            >
              or with email
            </span>
            <div
              style={{
                flex: 1,
                height: 1,
                background: "rgba(212,184,150,0.28)",
              }}
            />
          </div>

          <AuthError msg={authError} />

          <div style={{ marginBottom: 16 }}>
            <label style={LABEL}>Email</label>
            <input
              style={INPUT}
              type="email"
              placeholder="you@example.com"
              value={authForm.email}
              onChange={(e) =>
                setAuthForm((p) => ({ ...p, email: e.target.value }))
              }
              onKeyDown={(e) => e.key === "Enter" && handleEmailLogin()}
            />
          </div>

          <div style={{ marginBottom: 26 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 7,
              }}
            >
              <label style={{ ...LABEL, marginBottom: 0 }}>Password</label>
              <button
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 11,
                  color: "#C8877A",
                  fontFamily: "'Jost',sans-serif",
                  fontWeight: 600,
                }}
              >
                Forgot password?
              </button>
            </div>
            <div style={{ position: "relative" }}>
              <input
                style={INPUT}
                type={passwordVisible ? "text" : "password"}
                placeholder="••••••••"
                value={authForm.password}
                onChange={(e) =>
                  setAuthForm((p) => ({ ...p, password: e.target.value }))
                }
                onKeyDown={(e) => e.key === "Enter" && handleEmailLogin()}
              />
              <button
                onClick={() => setPasswordVisible((v) => !v)}
                style={{
                  position: "absolute",
                  right: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 15,
                  color: "#B8A090",
                  lineHeight: 1,
                }}
              >
                {passwordVisible ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          <button
            className="btn-hover"
            onClick={handleEmailLogin}
            disabled={authLoading}
            style={{
              width: "100%",
              padding: "14px",
              background: ROSE,
              color: "#fff",
              border: "none",
              borderRadius: 14,
              cursor: "pointer",
              fontSize: 14,
              fontFamily: "'Jost',sans-serif",
              fontWeight: 600,
              letterSpacing: "0.05em",
              boxShadow: "0 4px 20px rgba(200,135,122,0.35)",
              marginBottom: 22,
              transition: "all 0.2s",
            }}
          >
            {authLoading ? "Signing in..." : "Sign In →"}
          </button>

          <div
            style={{
              textAlign: "center",
              fontSize: 13,
              color: "#A09080",
              fontFamily: "'Jost',sans-serif",
            }}
          >
            New to HadaPod?{" "}
            <button
              onClick={() => {
                setAuthScreen("signup");
                setAuthError("");
              }}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#C8877A",
                fontWeight: 600,
                fontSize: 13,
                fontFamily: "'Jost',sans-serif",
              }}
            >
              Create a free account →
            </button>
          </div>
        </div>
      </div>
    );

  // ════════════ SIGN UP ════════════
  if (!isLoggedIn && authScreen === "signup")
    return (
      <div
        style={{
          minHeight: "100vh",
          background: BG,
          fontFamily: "'Jost',sans-serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
          overflowY: "auto",
        }}
      >
        <style>{SHARED_STYLE}</style>
        <div
          className="pulse"
          style={{
            position: "fixed",
            top: -120,
            left: -80,
            width: 420,
            height: 420,
            borderRadius: "50%",
            background: "rgba(212,184,150,0.12)",
            pointerEvents: "none",
          }}
        />

        <div
          className="fade-in"
          style={{
            ...GLASS,
            padding: "44px 40px",
            width: "100%",
            maxWidth: 440,
            position: "relative",
            zIndex: 1,
          }}
        >
          <button
            onClick={() => setAuthScreen("landing")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 13,
              color: "#B8A090",
              fontFamily: "'Jost',sans-serif",
              marginBottom: 30,
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: 0,
            }}
          >
            ← Back
          </button>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 13,
              marginBottom: 34,
            }}
          >
            <div
              style={{
                width: 46,
                height: 46,
                background: "linear-gradient(135deg,#EEC8C0,#F4DDD0)",
                borderRadius: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
                boxShadow: "0 4px 16px rgba(200,135,122,0.22)",
              }}
            >
              🌸
            </div>
            <div>
              <div
                style={{
                  fontFamily: "'Cormorant Garamond',serif",
                  fontSize: 23,
                  fontWeight: 700,
                  color: "#2A2018",
                  lineHeight: 1.1,
                }}
              >
                Create your account
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "#B8A090",
                  fontFamily: "'Jost',sans-serif",
                  marginTop: 2,
                }}
              >
                Start your personalised skincare journey
              </div>
            </div>
          </div>

          {/* Google */}
          <button
            className="goog-btn"
            onClick={handleGoogleLogin}
            disabled={authLoading}
            style={{
              width: "100%",
              padding: "14px",
              background: "#fff",
              border: "1.5px solid rgba(212,184,150,0.45)",
              borderRadius: 14,
              cursor: "pointer",
              fontSize: 14,
              fontFamily: "'Jost',sans-serif",
              fontWeight: 500,
              color: "#3A2A1A",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              marginBottom: 22,
              boxShadow: "0 2px 12px rgba(160,110,80,0.07)",
              transition: "all 0.2s",
            }}
          >
            {authLoading ? <span>⏳</span> : <GoogleLogo />}
            {authLoading ? "Creating account..." : "Sign up with Google"}
          </button>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              marginBottom: 22,
            }}
          >
            <div
              style={{
                flex: 1,
                height: 1,
                background: "rgba(212,184,150,0.28)",
              }}
            />
            <span
              style={{
                fontSize: 11,
                color: "#C8BFB5",
                fontFamily: "'Jost',sans-serif",
                whiteSpace: "nowrap",
              }}
            >
              or with email
            </span>
            <div
              style={{
                flex: 1,
                height: 1,
                background: "rgba(212,184,150,0.28)",
              }}
            />
          </div>

          <AuthError msg={authError} />

          <div style={{ marginBottom: 14 }}>
            <label style={LABEL}>Full Name</label>
            <input
              style={INPUT}
              placeholder="Your name"
              value={authForm.name}
              onChange={(e) =>
                setAuthForm((p) => ({ ...p, name: e.target.value }))
              }
            />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={LABEL}>Email Address</label>
            <input
              style={INPUT}
              type="email"
              placeholder="you@example.com"
              value={authForm.email}
              onChange={(e) =>
                setAuthForm((p) => ({ ...p, email: e.target.value }))
              }
            />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={LABEL}>Password</label>
            <div style={{ position: "relative" }}>
              <input
                style={INPUT}
                type={passwordVisible ? "text" : "password"}
                placeholder="Min. 6 characters"
                value={authForm.password}
                onChange={(e) =>
                  setAuthForm((p) => ({ ...p, password: e.target.value }))
                }
              />
              <button
                onClick={() => setPasswordVisible((v) => !v)}
                style={{
                  position: "absolute",
                  right: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 15,
                  color: "#B8A090",
                  lineHeight: 1,
                }}
              >
                {passwordVisible ? "🙈" : "👁"}
              </button>
            </div>
          </div>
          <div style={{ marginBottom: 26 }}>
            <label style={LABEL}>Confirm Password</label>
            <input
              style={INPUT}
              type="password"
              placeholder="Repeat your password"
              value={authForm.confirmPassword}
              onChange={(e) =>
                setAuthForm((p) => ({ ...p, confirmPassword: e.target.value }))
              }
              onKeyDown={(e) => e.key === "Enter" && handleEmailSignup()}
            />
          </div>

          <button
            className="btn-hover"
            onClick={handleEmailSignup}
            disabled={authLoading}
            style={{
              width: "100%",
              padding: "14px",
              background: ROSE,
              color: "#fff",
              border: "none",
              borderRadius: 14,
              cursor: "pointer",
              fontSize: 14,
              fontFamily: "'Jost',sans-serif",
              fontWeight: 600,
              letterSpacing: "0.05em",
              boxShadow: "0 4px 20px rgba(200,135,122,0.35)",
              marginBottom: 14,
              transition: "all 0.2s",
            }}
          >
            {authLoading ? "Creating your account..." : "Create Account →"}
          </button>

          <div
            style={{
              textAlign: "center",
              fontSize: 11,
              color: "#C8BFB5",
              fontFamily: "'Jost',sans-serif",
              lineHeight: 1.65,
              marginBottom: 16,
            }}
          >
            By signing up you agree to our Terms of Service and Privacy Policy.
          </div>
          <div
            style={{
              textAlign: "center",
              fontSize: 13,
              color: "#A09080",
              fontFamily: "'Jost',sans-serif",
            }}
          >
            Already have an account?{" "}
            <button
              onClick={() => {
                setAuthScreen("login");
                setAuthError("");
              }}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#C8877A",
                fontWeight: 600,
                fontSize: 13,
                fontFamily: "'Jost',sans-serif",
              }}
            >
              Sign in →
            </button>
          </div>
        </div>
      </div>
    );

  // ════════════ ONBOARDING ════════════
  if (isLoggedIn && authScreen === "onboarding") {
    const STEPS = [
      {
        title: "What are your main skin concerns?",
        sub: "Select all that apply — Sora will tailor everything to you.",
        type: "multi",
        key: "skinConcerns",
        opts: [
          { l: "Acne & Breakouts", e: "🔴" },
          { l: "Dryness & Flaking", e: "🏜" },
          { l: "Oiliness", e: "💧" },
          { l: "Ageing & Fine Lines", e: "⏳" },
          { l: "Hyperpigmentation", e: "🌗" },
          { l: "Redness & Sensitivity", e: "🌹" },
          { l: "Large Pores", e: "🔬" },
          { l: "Dull Skin", e: "☁️" },
        ],
      },
      {
        title: "What's your skin type?",
        sub: "Don't worry — you can always refine this after a full photo analysis.",
        type: "single",
        key: "skinType",
        opts: [
          { l: "Normal", e: "🌿", d: "Balanced, minimal issues" },
          { l: "Dry", e: "🏜", d: "Tight, flaky or dull" },
          { l: "Oily", e: "💧", d: "Shiny, prone to breakouts" },
          { l: "Combination", e: "☯️", d: "Oily T-zone, dry cheeks" },
          { l: "Sensitive", e: "🌸", d: "Easily irritated or red" },
        ],
      },
      {
        title: "What are your skincare goals?",
        sub: "Sora will focus your recommendations around these.",
        type: "multi",
        key: "skinGoals",
        opts: [
          { l: "Clearer Skin", e: "✨" },
          { l: "Anti-Ageing", e: "⏳" },
          { l: "Deep Hydration", e: "💦" },
          { l: "Even Skin Tone", e: "🌗" },
          { l: "Glow & Radiance", e: "🌟" },
          { l: "Minimise Pores", e: "🔍" },
          { l: "Barrier Repair", e: "🛡️" },
          { l: "Natural Ingredients", e: "🌿" },
        ],
      },
    ];
    const step = STEPS[onboardStep];

    return (
      <div
        style={{
          minHeight: "100vh",
          background: BG,
          fontFamily: "'Jost',sans-serif",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "32px 20px 48px",
          overflowY: "auto",
        }}
      >
        <style>{SHARED_STYLE}</style>
        <div
          className="pulse"
          style={{
            position: "fixed",
            top: -80,
            right: -80,
            width: 360,
            height: 360,
            borderRadius: "50%",
            background: "rgba(200,135,122,0.09)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            width: "100%",
            maxWidth: 560,
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Top bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 30,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  background: "linear-gradient(135deg,#EEC8C0,#F4DDD0)",
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                }}
              >
                🌸
              </div>
              <span
                style={{
                  fontFamily: "'Cormorant Garamond',serif",
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#2A2018",
                }}
              >
                HadaPod
              </span>
            </div>
            <button
              onClick={finishOnboarding}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: 12,
                color: "#B8A090",
                fontFamily: "'Jost',sans-serif",
              }}
            >
              Skip for now →
            </button>
          </div>

          {/* Progress */}
          <div style={{ marginBottom: 32 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  color: "#B8A090",
                  fontFamily: "'Jost',sans-serif",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                Step {onboardStep + 1} of {STEPS.length}
              </span>
              <span
                style={{
                  fontSize: 11,
                  color: "#C8877A",
                  fontFamily: "'Jost',sans-serif",
                  fontWeight: 600,
                }}
              >
                {Math.round(((onboardStep + 1) / STEPS.length) * 100)}% complete
              </span>
            </div>
            <div
              style={{
                height: 5,
                background: "rgba(212,184,150,0.22)",
                borderRadius: 10,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  background: "linear-gradient(90deg,#C8877A,#D4B896)",
                  borderRadius: 10,
                  width: `${((onboardStep + 1) / STEPS.length) * 100}%`,
                  transition: "width 0.5s cubic-bezier(0.22,1,0.36,1)",
                }}
              />
            </div>
          </div>

          {/* Welcome banner */}
          {onboardStep === 0 && currentUser && (
            <div
              className="fade-in"
              style={{
                background: "rgba(255,255,255,0.6)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(212,184,150,0.3)",
                borderRadius: 18,
                padding: "18px 22px",
                marginBottom: 22,
                display: "flex",
                alignItems: "center",
                gap: 14,
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  background: ROSE,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 15,
                  color: "#fff",
                  fontFamily: "'Jost',sans-serif",
                  fontWeight: 700,
                  flexShrink: 0,
                  boxShadow: "0 4px 14px rgba(200,135,122,0.35)",
                }}
              >
                {currentUser.avatar}
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "'Cormorant Garamond',serif",
                    fontSize: 18,
                    fontWeight: 700,
                    color: "#2A2018",
                  }}
                >
                  Welcome, {currentUser.name.split(" ")[0]}! 🌸
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "#A09080",
                    fontFamily: "'Jost',sans-serif",
                    marginTop: 2,
                  }}
                >
                  Let's personalise HadaPod for your unique skin in 3 quick
                  steps.
                </div>
              </div>
            </div>
          )}

          {/* Question card */}
          <div
            className="fade-in"
            style={{ ...GLASS, padding: "36px 32px", marginBottom: 18 }}
          >
            <div
              style={{
                fontFamily: "'Cormorant Garamond',serif",
                fontSize: 27,
                fontWeight: 700,
                color: "#2A2018",
                marginBottom: 8,
                lineHeight: 1.2,
              }}
            >
              {step.title}
            </div>
            <div
              style={{
                fontSize: 13,
                color: "#8A7060",
                fontFamily: "'Jost',sans-serif",
                marginBottom: 26,
                lineHeight: 1.65,
              }}
            >
              {step.sub}
            </div>

            {step.type === "multi" ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10,
                }}
              >
                {step.opts.map((o) => {
                  const sel = (onboardAnswers[step.key] || []).includes(o.l);
                  return (
                    <div
                      key={o.l}
                      className="opt-card"
                      onClick={() =>
                        setOnboardAnswers((prev) => {
                          const a = prev[step.key] || [];
                          return {
                            ...prev,
                            [step.key]: sel
                              ? a.filter((x) => x !== o.l)
                              : [...a, o.l],
                          };
                        })
                      }
                      style={{
                        padding: "13px 15px",
                        background: sel
                          ? "linear-gradient(135deg,rgba(200,135,122,0.12),rgba(212,184,150,0.15))"
                          : "rgba(255,255,255,0.5)",
                        border: `1.5px solid ${
                          sel
                            ? "rgba(200,135,122,0.55)"
                            : "rgba(212,184,150,0.3)"
                        }`,
                        borderRadius: 14,
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <span style={{ fontSize: 20 }}>{o.e}</span>
                      <span
                        style={{
                          fontSize: 12,
                          fontFamily: "'Jost',sans-serif",
                          fontWeight: sel ? 600 : 400,
                          color: sel ? "#C8877A" : "#4A3828",
                          flex: 1,
                        }}
                      >
                        {o.l}
                      </span>
                      {sel && (
                        <span
                          style={{
                            color: "#C8877A",
                            fontSize: 14,
                            flexShrink: 0,
                          }}
                        >
                          ✓
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                {step.opts.map((o) => {
                  const sel = onboardAnswers[step.key] === o.l;
                  return (
                    <div
                      key={o.l}
                      className="opt-card"
                      onClick={() =>
                        setOnboardAnswers((prev) => ({
                          ...prev,
                          [step.key]: o.l,
                        }))
                      }
                      style={{
                        padding: "15px 20px",
                        background: sel
                          ? "linear-gradient(135deg,rgba(200,135,122,0.12),rgba(212,184,150,0.15))"
                          : "rgba(255,255,255,0.5)",
                        border: `1.5px solid ${
                          sel
                            ? "rgba(200,135,122,0.55)"
                            : "rgba(212,184,150,0.3)"
                        }`,
                        borderRadius: 14,
                        display: "flex",
                        alignItems: "center",
                        gap: 14,
                      }}
                    >
                      <span style={{ fontSize: 26 }}>{o.e}</span>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontSize: 14,
                            fontFamily: "'Jost',sans-serif",
                            fontWeight: sel ? 600 : 500,
                            color: sel ? "#C8877A" : "#2A2018",
                          }}
                        >
                          {o.l}
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: "#A09080",
                            fontFamily: "'Jost',sans-serif",
                            marginTop: 2,
                          }}
                        >
                          {o.d}
                        </div>
                      </div>
                      <div
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: "50%",
                          border: `2px solid ${
                            sel ? "#C8877A" : "rgba(212,184,150,0.45)"
                          }`,
                          background: sel ? ROSE : "transparent",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          transition: "all 0.2s",
                        }}
                      >
                        {sel && (
                          <span
                            style={{
                              color: "#fff",
                              fontSize: 11,
                              fontWeight: 700,
                            }}
                          >
                            ✓
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Nav buttons */}
          <div style={{ display: "flex", gap: 12 }}>
            {onboardStep > 0 && (
              <button
                onClick={() => setOnboardStep((p) => p - 1)}
                style={{
                  flex: 1,
                  padding: "14px",
                  background: "rgba(255,255,255,0.6)",
                  border: "1px solid rgba(212,184,150,0.4)",
                  borderRadius: 14,
                  cursor: "pointer",
                  fontSize: 14,
                  fontFamily: "'Jost',sans-serif",
                  color: "#8A7060",
                  backdropFilter: "blur(8px)",
                  transition: "all 0.2s",
                }}
              >
                ← Back
              </button>
            )}
            <button
              className="btn-hover"
              onClick={() => {
                if (onboardStep < STEPS.length - 1)
                  setOnboardStep((p) => p + 1);
                else finishOnboarding();
              }}
              style={{
                flex: 2,
                padding: "14px",
                background: ROSE,
                color: "#fff",
                border: "none",
                borderRadius: 14,
                cursor: "pointer",
                fontSize: 14,
                fontFamily: "'Jost',sans-serif",
                fontWeight: 600,
                letterSpacing: "0.05em",
                boxShadow: "0 4px 20px rgba(200,135,122,0.35)",
                transition: "all 0.2s",
              }}
            >
              {onboardStep < STEPS.length - 1
                ? "Continue →"
                : "Enter HadaPod 🌸"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(145deg, #FBF7F2 0%, #F5EDE4 40%, #F0E8E2 70%, #EDE4DC 100%)",
        fontFamily: "'Jost',sans-serif",
        color: "#2A2018",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Jost:wght@300;400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        :root{
          --rose:#C8877A;--rose-light:#F0D8D4;--cream:#FBF7F2;--warm:#D4B896;
          --deep:#2A2018;--muted:#8A7060;--glass:rgba(255,255,255,0.7);
          --shadow:0 8px 40px rgba(160,110,80,0.15);
        }
        .fade-in{animation:fi 0.4s cubic-bezier(0.22,1,0.36,1)}
        @keyframes fi{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        .slide-up{animation:su 0.5s cubic-bezier(0.22,1,0.36,1)}
        @keyframes su{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
        .dot{display:inline-block;width:6px;height:6px;background:#C8877A;border-radius:50%;animation:bounce 1.4s infinite ease-in-out}
        .dot:nth-child(2){animation-delay:.2s;background:#D4B896}
        .dot:nth-child(3){animation-delay:.4s;background:#C8A87A}
        @keyframes bounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-8px)}}
        .hscroll{display:flex;gap:14px;overflow-x:auto;padding:4px 4px 12px}
        .hscroll::-webkit-scrollbar{height:3px}
        .hscroll::-webkit-scrollbar-thumb{background:rgba(200,135,122,0.3);border-radius:10px}
        input:focus,textarea:focus{outline:none;}
        .chip{padding:9px 18px;background:rgba(255,255,255,0.8);border:1px solid rgba(212,184,150,0.5);border-radius:24px;font-size:12px;cursor:pointer;transition:all .2s;font-family:'Jost',sans-serif;white-space:nowrap;color:#6A5A4A;backdrop-filter:blur(8px);letter-spacing:0.02em}
        .chip:hover{background:rgba(200,135,122,0.15);border-color:rgba(200,135,122,0.5);color:var(--rose)}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-thumb{background:rgba(200,135,122,0.2);border-radius:10px}
        .tab-btn{transition:all 0.25s cubic-bezier(0.22,1,0.36,1)}
        .col-card{transition:all 0.25s cubic-bezier(0.22,1,0.36,1)}
        .col-card:hover{transform:translateY(-6px);box-shadow:0 20px 60px rgba(160,110,80,0.2)!important}
        .send-btn:hover{background:rgba(200,135,122,0.9)!important;transform:scale(1.05)}
        .petal{position:absolute;pointer-events:none;opacity:0.06}
        input[type=file]{display:none}
      `}</style>

      {/* ── Toast Notification ── */}
      {notification && (
        <div
          className="slide-up"
          style={{
            position: "fixed",
            top: 24,
            left: "50%",
            transform: "translateX(-50%)",
            background: "linear-gradient(135deg,#C8877A,#D4956A)",
            color: "#fff",
            padding: "12px 28px",
            borderRadius: 30,
            fontSize: 13,
            zIndex: 9999,
            boxShadow: "0 8px 32px rgba(200,135,122,0.4)",
            fontFamily: "'Jost',sans-serif",
            letterSpacing: "0.04em",
          }}
        >
          {notification}
        </div>
      )}

      {/* ── Save to Collection Sheet ── */}
      {showAddToCollection && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(42,32,24,0.5)",
            zIndex: 1000,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            backdropFilter: "blur(4px)",
          }}
          onClick={() => setShowAddToCollection(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="slide-up"
            style={{
              background: "linear-gradient(180deg,#FBF7F2,#F5EDE4)",
              borderRadius: "28px 28px 0 0",
              padding: "32px 28px 40px",
              width: "100%",
              maxWidth: 500,
              boxShadow: "0 -20px 60px rgba(160,110,80,0.2)",
            }}
          >
            <div
              style={{
                width: 40,
                height: 4,
                background: "rgba(200,135,122,0.3)",
                borderRadius: 10,
                margin: "0 auto 24px",
              }}
            />
            <div
              style={{
                fontFamily: "'Cormorant Garamond',serif",
                fontSize: 22,
                fontWeight: 700,
                marginBottom: 4,
                color: "#2A2018",
              }}
            >
              Save to Collection
            </div>
            <div
              style={{
                fontSize: 13,
                color: "#A09080",
                marginBottom: 24,
                fontFamily: "'Jost',sans-serif",
              }}
            >
              "{showAddToCollection.name}"
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                maxHeight: 280,
                overflowY: "auto",
                marginBottom: 16,
              }}
            >
              {collections.map((col) => (
                <div
                  key={col.id}
                  onClick={() => addToCollection(col.id, showAddToCollection)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    padding: "14px 18px",
                    background: "rgba(255,255,255,0.7)",
                    border: "1px solid rgba(212,184,150,0.3)",
                    borderRadius: 16,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(200,135,122,0.1)";
                    e.currentTarget.style.borderColor = "rgba(200,135,122,0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.7)";
                    e.currentTarget.style.borderColor = "rgba(212,184,150,0.3)";
                  }}
                >
                  <span style={{ fontSize: 26 }}>{col.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontWeight: 500,
                        fontSize: 14,
                        color: "#2A2018",
                      }}
                    >
                      {col.name}
                    </div>
                    <div
                      style={{ fontSize: 11, color: "#A09080", marginTop: 1 }}
                    >
                      {col.items.length} items
                    </div>
                  </div>
                  <span
                    style={{ color: "rgba(200,135,122,0.5)", fontSize: 20 }}
                  >
                    ›
                  </span>
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                setShowCreateFolder(true);
                setShowAddToCollection(null);
              }}
              style={{
                width: "100%",
                padding: 14,
                background: "transparent",
                border: "1.5px dashed rgba(200,135,122,0.4)",
                borderRadius: 16,
                cursor: "pointer",
                fontSize: 13,
                color: "#C8877A",
                fontFamily: "'Jost',sans-serif",
                letterSpacing: "0.04em",
              }}
            >
              + Create new collection
            </button>
          </div>
        </div>
      )}

      {/* ── Create Folder Modal ── */}
      {showCreateFolder && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(42,32,24,0.5)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(4px)",
          }}
          onClick={() => setShowCreateFolder(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="fade-in"
            style={{
              background: "linear-gradient(145deg,#FBF7F2,#F5EDE4)",
              borderRadius: 24,
              padding: 32,
              width: 360,
              boxShadow: "0 24px 80px rgba(160,110,80,0.25)",
            }}
          >
            <div
              style={{
                fontFamily: "'Cormorant Garamond',serif",
                fontSize: 22,
                fontWeight: 700,
                marginBottom: 20,
                color: "#2A2018",
              }}
            >
              New Collection
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                marginBottom: 20,
              }}
            >
              {EMOJIS.map((em) => (
                <span
                  key={em}
                  onClick={() => setNewFolderEmoji(em)}
                  style={{
                    fontSize: 24,
                    cursor: "pointer",
                    padding: 8,
                    borderRadius: 10,
                    border:
                      newFolderEmoji === em
                        ? "2px solid rgba(200,135,122,0.6)"
                        : "2px solid transparent",
                    background:
                      newFolderEmoji === em
                        ? "rgba(200,135,122,0.12)"
                        : "transparent",
                    transition: "all 0.15s",
                  }}
                >
                  {em}
                </span>
              ))}
            </div>
            <input
              placeholder="Collection name..."
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && createFolder()}
              style={{
                width: "100%",
                padding: "13px 18px",
                border: "1px solid rgba(212,184,150,0.4)",
                borderRadius: 14,
                fontSize: 14,
                marginBottom: 16,
                fontFamily: "'Jost',sans-serif",
                background: "rgba(255,255,255,0.7)",
                color: "#2A2018",
              }}
            />
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setShowCreateFolder(false)}
                style={{
                  flex: 1,
                  padding: 12,
                  border: "1px solid rgba(212,184,150,0.4)",
                  background: "transparent",
                  borderRadius: 12,
                  cursor: "pointer",
                  fontSize: 13,
                  fontFamily: "'Jost',sans-serif",
                  color: "#8A7060",
                }}
              >
                Cancel
              </button>
              <button
                onClick={createFolder}
                style={{
                  flex: 1,
                  padding: 12,
                  background: "linear-gradient(135deg,#C8877A,#D4956A)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 12,
                  cursor: "pointer",
                  fontSize: 13,
                  fontFamily: "'Jost',sans-serif",
                  fontWeight: 600,
                }}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════
          HEADER
      ═══════════════════════════════════════ */}
      <header
        style={{
          background: "rgba(251,247,242,0.85)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(212,184,150,0.2)",
          padding: "16px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {/* Logo mark */}
          <div
            style={{
              width: 44,
              height: 44,
              background: "linear-gradient(135deg,#C8877A,#D4B896)",
              borderRadius: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              boxShadow: "0 4px 16px rgba(200,135,122,0.35)",
            }}
          >
            🌸
          </div>
          <div>
            <div
              style={{
                fontFamily: "'Cormorant Garamond',serif",
                color: "#2A2018",
                fontSize: 24,
                fontWeight: 700,
                letterSpacing: "-0.01em",
                lineHeight: 1,
              }}
            >
              HadaPod
            </div>
            <div
              style={{
                color: "#B8A090",
                fontSize: 9,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                marginTop: 2,
                fontFamily: "'Jost',sans-serif",
              }}
            >
              Skincare Intelligence
            </div>
          </div>
        </div>

        {skinType && (
          <div
            style={{
              background: "rgba(255,255,255,0.7)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(200,135,122,0.3)",
              padding: "8px 18px",
              borderRadius: 30,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: ANALYSIS_RESULTS[skinType]?.color || "#C8877A",
                boxShadow: `0 0 0 3px ${
                  ANALYSIS_RESULTS[skinType]?.color || "#C8877A"
                }33`,
              }}
            />
            <div>
              <div
                style={{
                  color: "#B8A090",
                  fontSize: 8,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  fontFamily: "'Jost',sans-serif",
                }}
              >
                Your Skin
              </div>
              <div
                style={{
                  fontFamily: "'Cormorant Garamond',serif",
                  color: "#2A2018",
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                {skinType}
              </div>
            </div>
          </div>
        )}
        {currentUser && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 36,
                height: 36,
                background: "linear-gradient(135deg,#C8877A,#D4956A)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                color: "#fff",
                fontFamily: "'Jost',sans-serif",
                fontWeight: 700,
                boxShadow: "0 2px 10px rgba(200,135,122,0.35)",
                cursor: "pointer",
                flexShrink: 0,
              }}
              title={currentUser.email}
            >
              {currentUser.avatar}
            </div>
            <button
              onClick={() => {
                setIsLoggedIn(false);
                setCurrentUser(null);
                setAuthScreen("landing");
                setAuthForm({
                  name: "",
                  email: "",
                  password: "",
                  confirmPassword: "",
                });
              }}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: 11,
                color: "#B8A090",
                fontFamily: "'Jost',sans-serif",
                padding: 0,
              }}
              title="Sign out"
            >
              Sign out
            </button>
          </div>
        )}
      </header>

      {/* ── Top Nav ── */}
      <nav
        style={{
          background: "rgba(251,247,242,0.92)",
          backdropFilter: "blur(24px)",
          borderBottom: "1px solid rgba(212,184,150,0.25)",
          display: "flex",
          padding: "0 24px",
          overflowX: "auto",
        }}
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            className="tab-btn"
            onClick={() => setActiveTab(t.id)}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              borderBottom:
                activeTab === t.id
                  ? "3px solid #C8877A"
                  : "3px solid transparent",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
              padding: "14px 12px",
              minWidth: 100,
              transition: "all 0.25s cubic-bezier(0.22,1,0.36,1)",
            }}
          >
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: 16,
                background:
                  activeTab === t.id
                    ? "linear-gradient(135deg,#C8877A,#D4956A)"
                    : "rgba(212,184,150,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s cubic-bezier(0.22,1,0.36,1)",
                boxShadow:
                  activeTab === t.id
                    ? "0 4px 16px rgba(200,135,122,0.4)"
                    : "none",
              }}
            >
              <span
                style={{
                  fontSize: 22,
                  color: activeTab === t.id ? "#fff" : "#B8A090",
                }}
              >
                {t.icon}
              </span>
            </div>
            <span
              style={{
                fontSize: 10,
                letterSpacing: "0.07em",
                textTransform: "uppercase",
                color: activeTab === t.id ? "#C8877A" : "#B8A090",
                fontFamily: "'Jost',sans-serif",
                fontWeight: activeTab === t.id ? 600 : 400,
                whiteSpace: "nowrap",
              }}
            >
              {t.label}
            </span>
          </button>
        ))}
      </nav>

      {/* ══ MAIN CONTENT AREA ══ */}
      <main style={{ paddingBottom: 40 }}>
        {/* ══════════════ HOME TAB ══════════════ */}
        {activeTab === "home" && (
          <div
            className="fade-in"
            style={{ maxWidth: 960, margin: "0 auto", padding: "0 0 48px" }}
          >
            {/* ── Hero Banner ── */}
            <div
              style={{
                position: "relative",
                overflow: "hidden",
                background:
                  "linear-gradient(135deg,#E8C4BC 0%,#F0D8C8 40%,#EDD8C0 70%,#E8D4B8 100%)",
                padding: "52px 40px 48px",
                marginBottom: 32,
              }}
            >
              {/* Decorative circles */}
              <div
                style={{
                  position: "absolute",
                  top: -60,
                  right: -60,
                  width: 280,
                  height: 280,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.2)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: -40,
                  right: 80,
                  width: 160,
                  height: 160,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.15)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: 20,
                  right: 160,
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.12)",
                }}
              />

              <div style={{ position: "relative", zIndex: 1, maxWidth: 520 }}>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    background: "rgba(255,255,255,0.45)",
                    backdropFilter: "blur(8px)",
                    padding: "6px 16px",
                    borderRadius: 20,
                    marginBottom: 20,
                    border: "1px solid rgba(255,255,255,0.5)",
                  }}
                >
                  <span style={{ fontSize: 12 }}>🌸</span>
                  <span
                    style={{
                      fontSize: 11,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "#8A5A4A",
                      fontFamily: "'Jost',sans-serif",
                      fontWeight: 600,
                    }}
                  >
                    Evidence-Based Skincare
                  </span>
                </div>
                <div
                  style={{
                    fontFamily: "'Cormorant Garamond',serif",
                    fontSize: 46,
                    fontWeight: 700,
                    color: "#2A1810",
                    lineHeight: 1.1,
                    marginBottom: 16,
                  }}
                >
                  Your skin,
                  <br />
                  <em style={{ color: "#C8877A" }}>understood.</em>
                </div>
                <div
                  style={{
                    fontSize: 15,
                    color: "#6A4A3A",
                    lineHeight: 1.7,
                    marginBottom: 28,
                    fontFamily: "'Jost',sans-serif",
                    maxWidth: 420,
                  }}
                >
                  HadaPod combines AI skin analysis, ingredient science, and
                  your personal routine — all in one beautiful place.
                </div>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <button
                    onClick={() => setActiveTab("analyze")}
                    style={{
                      padding: "13px 28px",
                      background: "linear-gradient(135deg,#C8877A,#D4956A)",
                      color: "#fff",
                      border: "none",
                      borderRadius: 30,
                      cursor: "pointer",
                      fontSize: 13,
                      fontFamily: "'Jost',sans-serif",
                      fontWeight: 600,
                      letterSpacing: "0.06em",
                      boxShadow: "0 6px 24px rgba(200,135,122,0.45)",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "translateY(-2px)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "translateY(0)")
                    }
                  >
                    Analyse My Skin →
                  </button>
                  <button
                    onClick={() => setActiveTab("chat")}
                    style={{
                      padding: "13px 28px",
                      background: "rgba(255,255,255,0.55)",
                      color: "#8A5A4A",
                      border: "1px solid rgba(255,255,255,0.7)",
                      borderRadius: 30,
                      cursor: "pointer",
                      fontSize: 13,
                      fontFamily: "'Jost',sans-serif",
                      fontWeight: 500,
                      backdropFilter: "blur(8px)",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(255,255,255,0.75)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(255,255,255,0.55)")
                    }
                  >
                    Chat with Sora 🌸
                  </button>
                </div>
              </div>

              {/* Floating skin type badge if analysed */}
              {skinType && (
                <div
                  style={{
                    position: "absolute",
                    bottom: 24,
                    right: 32,
                    background: "rgba(255,255,255,0.7)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(200,135,122,0.3)",
                    borderRadius: 20,
                    padding: "12px 20px",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background:
                        ANALYSIS_RESULTS[skinType]?.color || "#C8877A",
                      boxShadow: `0 0 0 3px ${
                        ANALYSIS_RESULTS[skinType]?.color || "#C8877A"
                      }33`,
                    }}
                  />
                  <div>
                    <div
                      style={{
                        fontSize: 9,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: "#A09080",
                        fontFamily: "'Jost',sans-serif",
                        fontWeight: 600,
                      }}
                    >
                      Your Skin Type
                    </div>
                    <div
                      style={{
                        fontFamily: "'Cormorant Garamond',serif",
                        fontSize: 16,
                        fontWeight: 700,
                        color: "#2A2018",
                      }}
                    >
                      {skinType}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div style={{ padding: "0 24px" }}>
              {/* ── Quick Actions ── */}
              <div style={{ marginBottom: 36 }}>
                <div
                  style={{
                    fontFamily: "'Cormorant Garamond',serif",
                    fontSize: 24,
                    fontWeight: 700,
                    color: "#2A2018",
                    marginBottom: 16,
                  }}
                >
                  Quick Actions
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))",
                    gap: 14,
                  }}
                >
                  {[
                    {
                      icon: "🔬",
                      label: "Analyse My Skin",
                      sub: "Upload a photo for AI detection",
                      tab: "analyze",
                      grad: "linear-gradient(135deg,rgba(200,135,122,0.15),rgba(212,184,150,0.2))",
                      accent: "#C8877A",
                    },
                    {
                      icon: "🌸",
                      label: "Chat with Sora",
                      sub: "Get personalised recommendations",
                      tab: "chat",
                      grad: "linear-gradient(135deg,rgba(180,140,200,0.15),rgba(200,160,220,0.2))",
                      accent: "#B07AC8",
                    },
                    {
                      icon: "⭐",
                      label: "My Collections",
                      sub: "View your saved products",
                      tab: "profile",
                      grad: "linear-gradient(135deg,rgba(212,184,100,0.15),rgba(230,200,120,0.2))",
                      accent: "#C8A840",
                    },
                    {
                      icon: "☀️",
                      label: "My Routine",
                      sub: "Track your daily steps",
                      tab: "routine",
                      grad: "linear-gradient(135deg,rgba(120,180,120,0.15),rgba(140,200,140,0.2))",
                      accent: "#7BAF7B",
                    },
                  ].map((action) => (
                    <div
                      key={action.tab}
                      onClick={() => setActiveTab(action.tab)}
                      style={{
                        background: action.grad,
                        border: `1px solid ${action.accent}30`,
                        borderRadius: 20,
                        padding: "22px 20px",
                        cursor: "pointer",
                        transition: "all 0.25s cubic-bezier(0.22,1,0.36,1)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-4px)";
                        e.currentTarget.style.boxShadow = `0 16px 48px ${action.accent}25`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      <div style={{ fontSize: 32, marginBottom: 12 }}>
                        {action.icon}
                      </div>
                      <div
                        style={{
                          fontFamily: "'Cormorant Garamond',serif",
                          fontSize: 16,
                          fontWeight: 700,
                          color: "#2A2018",
                          marginBottom: 4,
                        }}
                      >
                        {action.label}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: "#8A7060",
                          fontFamily: "'Jost',sans-serif",
                          lineHeight: 1.5,
                        }}
                      >
                        {action.sub}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Skin Summary (if analysed) OR CTA ── */}
              {skinType ? (
                <div style={{ marginBottom: 36 }}>
                  <div
                    style={{
                      fontFamily: "'Cormorant Garamond',serif",
                      fontSize: 24,
                      fontWeight: 700,
                      color: "#2A2018",
                      marginBottom: 16,
                    }}
                  >
                    Your Skin at a Glance
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 14,
                    }}
                  >
                    <div
                      style={{
                        background: "rgba(255,255,255,0.7)",
                        backdropFilter: "blur(16px)",
                        border: "1px solid rgba(212,184,150,0.3)",
                        borderRadius: 20,
                        padding: 22,
                        boxShadow: "0 4px 20px rgba(160,110,80,0.08)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 14,
                          marginBottom: 16,
                        }}
                      >
                        <div
                          style={{
                            width: 48,
                            height: 48,
                            borderRadius: "50%",
                            background: `${ANALYSIS_RESULTS[skinType].color}22`,
                            border: `2px solid ${ANALYSIS_RESULTS[skinType].color}44`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <div
                            style={{
                              width: 14,
                              height: 14,
                              borderRadius: "50%",
                              background: ANALYSIS_RESULTS[skinType].color,
                            }}
                          />
                        </div>
                        <div>
                          <div
                            style={{
                              fontSize: 10,
                              letterSpacing: "0.14em",
                              textTransform: "uppercase",
                              color: "#B8A090",
                              fontFamily: "'Jost',sans-serif",
                              fontWeight: 600,
                            }}
                          >
                            Skin Type
                          </div>
                          <div
                            style={{
                              fontFamily: "'Cormorant Garamond',serif",
                              fontSize: 20,
                              fontWeight: 700,
                              color: "#2A2018",
                            }}
                          >
                            {skinType}
                          </div>
                        </div>
                      </div>
                      {ANALYSIS_RESULTS[skinType].characteristics.map(
                        (c, i) => (
                          <div
                            key={i}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 10,
                              marginBottom: 8,
                              fontSize: 12,
                              fontFamily: "'Jost',sans-serif",
                              color: "#6A5A4A",
                            }}
                          >
                            <div
                              style={{
                                width: 5,
                                height: 5,
                                borderRadius: "50%",
                                background: ANALYSIS_RESULTS[skinType].color,
                                flexShrink: 0,
                              }}
                            />
                            {c}
                          </div>
                        )
                      )}
                    </div>
                    <div
                      style={{
                        background: "rgba(255,255,255,0.7)",
                        backdropFilter: "blur(16px)",
                        border: "1px solid rgba(212,184,150,0.3)",
                        borderRadius: 20,
                        padding: 22,
                        boxShadow: "0 4px 20px rgba(160,110,80,0.08)",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 10,
                          letterSpacing: "0.14em",
                          textTransform: "uppercase",
                          color: "#B8A090",
                          fontFamily: "'Jost',sans-serif",
                          fontWeight: 600,
                          marginBottom: 14,
                        }}
                      >
                        Key Concerns
                      </div>
                      {ANALYSIS_RESULTS[skinType].concerns.map((c, i) => (
                        <div
                          key={i}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            marginBottom: 10,
                            fontSize: 12,
                            fontFamily: "'Jost',sans-serif",
                            color: "#6A5A4A",
                          }}
                        >
                          <div
                            style={{
                              width: 5,
                              height: 5,
                              borderRadius: "50%",
                              background: "rgba(200,135,122,0.7)",
                              flexShrink: 0,
                            }}
                          />
                          {c}
                        </div>
                      ))}
                      <div
                        style={{
                          marginTop: 16,
                          padding: "10px 14px",
                          background:
                            "linear-gradient(135deg,rgba(200,135,122,0.1),rgba(212,184,150,0.12))",
                          borderRadius: 12,
                          fontSize: 11,
                          color: "#C8877A",
                          fontFamily: "'Jost',sans-serif",
                          fontStyle: "italic",
                          border: "1px solid rgba(200,135,122,0.2)",
                        }}
                      >
                        Ask Sora how to address these →
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => setActiveTab("analyze")}
                  style={{
                    marginBottom: 36,
                    background:
                      "linear-gradient(135deg,rgba(200,135,122,0.12),rgba(212,184,150,0.15))",
                    border: "2px dashed rgba(200,135,122,0.3)",
                    borderRadius: 24,
                    padding: "36px 32px",
                    cursor: "pointer",
                    textAlign: "center",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor =
                      "rgba(200,135,122,0.55)";
                    e.currentTarget.style.background =
                      "linear-gradient(135deg,rgba(200,135,122,0.18),rgba(212,184,150,0.22))";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(200,135,122,0.3)";
                    e.currentTarget.style.background =
                      "linear-gradient(135deg,rgba(200,135,122,0.12),rgba(212,184,150,0.15))";
                  }}
                >
                  <div style={{ fontSize: 48, marginBottom: 14 }}>🔬</div>
                  <div
                    style={{
                      fontFamily: "'Cormorant Garamond',serif",
                      fontSize: 22,
                      fontWeight: 700,
                      color: "#2A2018",
                      marginBottom: 8,
                    }}
                  >
                    Discover Your Skin Type
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "#8A7060",
                      fontFamily: "'Jost',sans-serif",
                      lineHeight: 1.6,
                      marginBottom: 20,
                      maxWidth: 380,
                      margin: "0 auto 20px",
                    }}
                  >
                    Upload a photo or answer a few quick questions to get a
                    personalised skin analysis and tailored recommendations.
                  </div>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "11px 28px",
                      background: "linear-gradient(135deg,#C8877A,#D4956A)",
                      color: "#fff",
                      borderRadius: 24,
                      fontSize: 13,
                      fontFamily: "'Jost',sans-serif",
                      fontWeight: 600,
                      boxShadow: "0 4px 16px rgba(200,135,122,0.35)",
                    }}
                  >
                    Start My Analysis →
                  </span>
                </div>
              )}

              {/* ── Today's Routine Snapshot ── */}
              <div style={{ marginBottom: 36 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 16,
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Cormorant Garamond',serif",
                      fontSize: 24,
                      fontWeight: 700,
                      color: "#2A2018",
                    }}
                  >
                    Today's Routine
                  </div>
                  <button
                    onClick={() => setActiveTab("routine")}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: 12,
                      color: "#C8877A",
                      fontFamily: "'Jost',sans-serif",
                      fontWeight: 600,
                      letterSpacing: "0.04em",
                    }}
                  >
                    View all →
                  </button>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 14,
                  }}
                >
                  {["AM", "PM"].map((t) => {
                    const total = Object.values(routine[t]).filter(
                      Boolean
                    ).length;
                    const done = Object.values(completedSteps[t]).filter(
                      Boolean
                    ).length;
                    const pct =
                      total > 0 ? Math.round((done / total) * 100) : 0;
                    return (
                      <div
                        key={t}
                        onClick={() => {
                          setRoutineTime(t);
                          setActiveTab("routine");
                        }}
                        style={{
                          background: "rgba(255,255,255,0.7)",
                          backdropFilter: "blur(16px)",
                          border: "1px solid rgba(212,184,150,0.3)",
                          borderRadius: 20,
                          padding: 22,
                          cursor: "pointer",
                          boxShadow: "0 4px 20px rgba(160,110,80,0.08)",
                          transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.transform = "translateY(-3px)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.transform = "translateY(0)")
                        }
                      >
                        <div style={{ fontSize: 28, marginBottom: 10 }}>
                          {t === "AM" ? "☀️" : "🌙"}
                        </div>
                        <div
                          style={{
                            fontFamily: "'Cormorant Garamond',serif",
                            fontSize: 17,
                            fontWeight: 700,
                            color: "#2A2018",
                            marginBottom: 4,
                          }}
                        >
                          {t === "AM" ? "Morning" : "Evening"}
                        </div>
                        <div
                          style={{
                            height: 5,
                            background: "rgba(212,184,150,0.25)",
                            borderRadius: 10,
                            overflow: "hidden",
                            marginBottom: 8,
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              background:
                                pct === 100
                                  ? "linear-gradient(90deg,#7BAF7B,#A8D8A8)"
                                  : "linear-gradient(90deg,#C8877A,#D4B896)",
                              width: `${pct}%`,
                              borderRadius: 10,
                              transition: "width 0.6s",
                            }}
                          />
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: pct === 100 ? "#7BAF7B" : "#B8A090",
                            fontFamily: "'Jost',sans-serif",
                          }}
                        >
                          {pct === 100
                            ? "✓ Complete!"
                            : total === 0
                            ? "No steps added yet"
                            : `${done}/${total} steps done`}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ── Featured Ingredients ── */}
              <div style={{ marginBottom: 36 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 16,
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Cormorant Garamond',serif",
                      fontSize: 24,
                      fontWeight: 700,
                      color: "#2A2018",
                    }}
                  >
                    Ingredient Spotlight
                  </div>
                  <button
                    onClick={() => setActiveTab("chat")}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: 12,
                      color: "#C8877A",
                      fontFamily: "'Jost',sans-serif",
                      fontWeight: 600,
                      letterSpacing: "0.04em",
                    }}
                  >
                    Ask Sora →
                  </button>
                </div>
                <div className="hscroll">
                  {INGREDIENTS_DB.slice(0, 6).map((ing) => {
                    const tagColors = {
                      "Gold Standard": "#C9A84C",
                      Universal: "#7BAF7B",
                      "Hydration Hero": "#6FA3C4",
                      "Acne Fighter": "#C47B6F",
                      "Barrier Essential": "#B89BC8",
                      Brightening: "#D4956A",
                      "Sensitive Safe": "#D4878A",
                      Resurfacing: "#8A9BC4",
                    };
                    const color = tagColors[ing.tag] || "#C8877A";
                    return (
                      <div
                        key={ing.id}
                        style={{
                          background: "rgba(255,255,255,0.8)",
                          backdropFilter: "blur(12px)",
                          border: `1px solid ${color}30`,
                          borderRadius: 20,
                          padding: "20px 18px",
                          width: 200,
                          flexShrink: 0,
                          boxShadow: "0 6px 24px rgba(160,110,80,0.1)",
                          transition: "all 0.2s",
                          cursor: "pointer",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-4px)";
                          e.currentTarget.style.boxShadow = `0 16px 40px ${color}25`;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow =
                            "0 6px 24px rgba(160,110,80,0.1)";
                        }}
                      >
                        <div
                          style={{
                            display: "inline-block",
                            fontSize: 9,
                            letterSpacing: "0.12em",
                            textTransform: "uppercase",
                            padding: "4px 10px",
                            borderRadius: 12,
                            background: `${color}20`,
                            color: color,
                            border: `1px solid ${color}40`,
                            fontFamily: "'Jost',sans-serif",
                            fontWeight: 600,
                            marginBottom: 12,
                          }}
                        >
                          {ing.tag}
                        </div>
                        <div
                          style={{
                            fontFamily: "'Cormorant Garamond',serif",
                            fontSize: 17,
                            fontWeight: 700,
                            color: "#2A2018",
                            marginBottom: 4,
                            lineHeight: 1.2,
                          }}
                        >
                          {ing.name}
                        </div>
                        <div
                          style={{
                            fontSize: 10,
                            color: "#A09080",
                            marginBottom: 10,
                            fontFamily: "'Jost',sans-serif",
                          }}
                        >
                          {ing.category}
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: "#6A5A4A",
                            lineHeight: 1.6,
                            fontFamily: "'Jost',sans-serif",
                          }}
                        >
                          {ing.description.slice(0, 70)}...
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ── Sora CTA ── */}
              <div
                style={{
                  background:
                    "linear-gradient(135deg,#2A1810 0%,#3A2418 60%,#2A1C14 100%)",
                  borderRadius: 28,
                  padding: "36px 36px",
                  display: "flex",
                  alignItems: "center",
                  gap: 28,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    right: -30,
                    top: -30,
                    width: 200,
                    height: 200,
                    borderRadius: "50%",
                    background: "rgba(200,135,122,0.1)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    right: 60,
                    bottom: -40,
                    width: 120,
                    height: 120,
                    borderRadius: "50%",
                    background: "rgba(212,184,150,0.08)",
                  }}
                />
                <div
                  style={{
                    width: 72,
                    height: 72,
                    background:
                      "linear-gradient(135deg,rgba(200,135,122,0.3),rgba(212,184,150,0.4))",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 34,
                    flexShrink: 0,
                    boxShadow: "0 8px 32px rgba(200,135,122,0.3)",
                  }}
                >
                  🌸
                </div>
                <div style={{ flex: 1, position: "relative", zIndex: 1 }}>
                  <div
                    style={{
                      fontSize: 10,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: "rgba(200,135,122,0.7)",
                      fontFamily: "'Jost',sans-serif",
                      fontWeight: 600,
                      marginBottom: 6,
                    }}
                  >
                    Your AI Advisor
                  </div>
                  <div
                    style={{
                      fontFamily: "'Cormorant Garamond',serif",
                      color: "#FBF7F2",
                      fontSize: 26,
                      fontWeight: 700,
                      marginBottom: 8,
                      lineHeight: 1.2,
                    }}
                  >
                    Sora knows your skin
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "rgba(251,247,242,0.6)",
                      fontFamily: "'Jost',sans-serif",
                      lineHeight: 1.6,
                      marginBottom: 20,
                      maxWidth: 360,
                    }}
                  >
                    Ask about ingredients, get a routine, or send a photo — Sora
                    gives you real, evidence-backed answers instantly.
                  </div>
                  <button
                    onClick={() => setActiveTab("chat")}
                    style={{
                      padding: "12px 28px",
                      background: "linear-gradient(135deg,#C8877A,#D4956A)",
                      color: "#fff",
                      border: "none",
                      borderRadius: 24,
                      cursor: "pointer",
                      fontSize: 13,
                      fontFamily: "'Jost',sans-serif",
                      fontWeight: 600,
                      boxShadow: "0 4px 20px rgba(200,135,122,0.5)",
                      letterSpacing: "0.04em",
                    }}
                  >
                    Start a Conversation →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════ CHAT TAB ══════════════ */}
        {activeTab === "chat" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              height: "calc(100vh - 170px)",
            }}
          >
            <div
              style={{ flex: 1, overflowY: "auto", padding: "24px 20px 8px" }}
            >
              {/* Sora intro visual */}
              {messages.length === 1 && (
                <div
                  className="fade-in"
                  style={{ textAlign: "center", padding: "16px 0 24px" }}
                >
                  <div
                    style={{
                      width: 80,
                      height: 80,
                      background: "linear-gradient(135deg,#F0D8D4,#E8C8C0)",
                      borderRadius: "50%",
                      margin: "0 auto 16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 36,
                      boxShadow: "0 8px 32px rgba(200,135,122,0.25)",
                    }}
                  >
                    🌸
                  </div>
                  <div
                    style={{
                      fontFamily: "'Cormorant Garamond',serif",
                      fontSize: 18,
                      color: "#8A7060",
                      fontStyle: "italic",
                    }}
                  >
                    Your personal skincare guide
                  </div>
                </div>
              )}

              {/* Quick chips */}
              {messages.length === 1 && (
                <div
                  className="hscroll"
                  style={{ padding: "0 0 20px", justifyContent: "flex-start" }}
                >
                  {[
                    "I have acne",
                    "Dry skin help",
                    "Fight aging",
                    "Oily skin",
                    "What is Niacinamide?",
                    "Brighten skin",
                    "Sensitive skin",
                  ].map((c) => (
                    <span
                      key={c}
                      className="chip"
                      onClick={() => {
                        setChatInput(c);
                      }}
                    >
                      {c}
                    </span>
                  ))}
                </div>
              )}

              {/* Messages */}
              {messages.map((msg, idx) => (
                <div
                  key={msg.id}
                  className="fade-in"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: msg.from === "user" ? "flex-end" : "flex-start",
                    gap: 8,
                    marginBottom: 20,
                  }}
                >
                  {msg.from === "bot" && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: -2,
                      }}
                    >
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          background: "linear-gradient(135deg,#F0D8D4,#E8C8C0)",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 14,
                          boxShadow: "0 2px 8px rgba(200,135,122,0.2)",
                        }}
                      >
                        🌸
                      </div>
                      <span
                        style={{
                          fontSize: 11,
                          color: "#C8877A",
                          fontWeight: 600,
                          letterSpacing: "0.06em",
                          fontFamily: "'Jost',sans-serif",
                        }}
                      >
                        Sora
                      </span>
                    </div>
                  )}
                  {msg.photo && (
                    <div style={{ position: "relative" }}>
                      <img
                        src={msg.photo}
                        alt="uploaded"
                        style={{
                          width: 200,
                          height: 150,
                          objectFit: "cover",
                          borderRadius: "18px 18px 4px 18px",
                          boxShadow: "0 8px 24px rgba(160,110,80,0.2)",
                        }}
                      />
                    </div>
                  )}
                  {msg.text && (
                    <div
                      style={{
                        maxWidth: msg.from === "user" ? "320px" : "88%",
                        background:
                          msg.from === "user"
                            ? "linear-gradient(135deg,#C8877A,#D4956A)"
                            : "rgba(255,255,255,0.85)",
                        backdropFilter: "blur(12px)",
                        color: msg.from === "user" ? "#fff" : "#2A2018",
                        border:
                          msg.from === "bot"
                            ? "1px solid rgba(212,184,150,0.3)"
                            : "none",
                        borderRadius:
                          msg.from === "user"
                            ? "20px 20px 4px 20px"
                            : "4px 20px 20px 20px",
                        padding: "13px 18px",
                        fontSize: 14,
                        lineHeight: 1.7,
                        boxShadow:
                          msg.from === "user"
                            ? "0 4px 20px rgba(200,135,122,0.35)"
                            : "0 4px 20px rgba(160,110,80,0.08)",
                        fontFamily: "'Jost',sans-serif",
                      }}
                    >
                      <BoldText text={msg.text} />
                    </div>
                  )}
                  {msg.cards?.length > 0 && (
                    <div
                      className="hscroll"
                      style={{ width: "100%", maxWidth: "100%" }}
                    >
                      {msg.cards.map((item) => (
                        <ItemCard key={item.id} item={item} />
                      ))}
                    </div>
                  )}
                  {msg.followUp && (
                    <div
                      style={{
                        maxWidth: "88%",
                        background: "rgba(255,255,255,0.7)",
                        backdropFilter: "blur(12px)",
                        border: "1px solid rgba(212,184,150,0.3)",
                        borderRadius: "4px 20px 20px 20px",
                        padding: "13px 18px",
                        fontSize: 14,
                        lineHeight: 1.7,
                        fontFamily: "'Jost',sans-serif",
                        color: "#2A2018",
                      }}
                    >
                      {msg.followUp}
                    </div>
                  )}
                </div>
              ))}

              {/* Typing */}
              {isTyping && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    marginBottom: 20,
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        background: "linear-gradient(135deg,#F0D8D4,#E8C8C0)",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 14,
                      }}
                    >
                      🌸
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        color: "#C8877A",
                        fontWeight: 600,
                        letterSpacing: "0.06em",
                        fontFamily: "'Jost',sans-serif",
                      }}
                    >
                      Sora
                    </span>
                  </div>
                  <div
                    style={{
                      background: "rgba(255,255,255,0.85)",
                      backdropFilter: "blur(12px)",
                      border: "1px solid rgba(212,184,150,0.3)",
                      borderRadius: "4px 20px 20px 20px",
                      padding: "16px 22px",
                      display: "inline-flex",
                      gap: 6,
                      alignItems: "center",
                      boxShadow: "0 4px 20px rgba(160,110,80,0.08)",
                    }}
                  >
                    <span className="dot" />
                    <span className="dot" />
                    <span className="dot" />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Photo preview */}
            {chatPhotoPreview && (
              <div
                style={{
                  background: "rgba(251,247,242,0.95)",
                  borderTop: "1px solid rgba(212,184,150,0.2)",
                  padding: "12px 20px 0",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <div style={{ position: "relative" }}>
                  <img
                    src={chatPhotoPreview}
                    alt="preview"
                    style={{
                      width: 56,
                      height: 56,
                      objectFit: "cover",
                      borderRadius: 12,
                      border: "2px solid rgba(200,135,122,0.5)",
                    }}
                  />
                  <button
                    onClick={() => setChatPhotoPreview(null)}
                    style={{
                      position: "absolute",
                      top: -8,
                      right: -8,
                      width: 20,
                      height: 20,
                      background: "#C8877A",
                      color: "#fff",
                      border: "none",
                      borderRadius: "50%",
                      cursor: "pointer",
                      fontSize: 12,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    ×
                  </button>
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "#A09080",
                    fontFamily: "'Jost',sans-serif",
                    fontStyle: "italic",
                  }}
                >
                  📸 Sora will analyze this when you send
                </div>
              </div>
            )}

            {/* Input */}
            <div
              style={{
                background: "rgba(251,247,242,0.95)",
                backdropFilter: "blur(20px)",
                borderTop: "1px solid rgba(212,184,150,0.2)",
                padding: "14px 20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  alignItems: "center",
                  background: "rgba(255,255,255,0.8)",
                  border: "1.5px solid rgba(212,184,150,0.35)",
                  borderRadius: 28,
                  padding: "6px 6px 6px 18px",
                  boxShadow: "0 4px 20px rgba(160,110,80,0.08)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <button
                  onClick={() => chatFileRef.current.click()}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 20,
                    color: "#C8A87A",
                    padding: 0,
                    lineHeight: 1,
                    transition: "transform 0.2s",
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.15)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                >
                  📷
                </button>
                <input
                  ref={chatFileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleChatPhoto}
                />
                <input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Ask Sora anything about your skin..."
                  style={{
                    flex: 1,
                    border: "none",
                    background: "transparent",
                    fontSize: 14,
                    color: "#2A2018",
                    fontFamily: "'Jost',sans-serif",
                    outline: "none",
                  }}
                />
                <button
                  className="send-btn"
                  onClick={() => sendMessage()}
                  style={{
                    width: 40,
                    height: 40,
                    background: "linear-gradient(135deg,#C8877A,#D4956A)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "50%",
                    cursor: "pointer",
                    fontSize: 18,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    boxShadow: "0 4px 16px rgba(200,135,122,0.4)",
                    transition: "all 0.2s",
                  }}
                >
                  ↑
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════ ANALYSIS TAB ══════════════ */}
        {activeTab === "analyze" && (
          <div
            className="fade-in"
            style={{ padding: "32px 24px", maxWidth: 960, margin: "0 auto" }}
          >
            {/* Hero */}
            <div
              style={{
                background:
                  "linear-gradient(135deg,rgba(200,135,122,0.12),rgba(212,184,150,0.15))",
                border: "1px solid rgba(212,184,150,0.3)",
                borderRadius: 24,
                padding: "32px 36px",
                marginBottom: 28,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  right: -20,
                  top: -20,
                  width: 160,
                  height: 160,
                  background: "rgba(200,135,122,0.08)",
                  borderRadius: "50%",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  right: 60,
                  bottom: -40,
                  width: 100,
                  height: 100,
                  background: "rgba(212,184,150,0.1)",
                  borderRadius: "50%",
                }}
              />
              <div
                style={{
                  fontFamily: "'Cormorant Garamond',serif",
                  fontSize: 36,
                  fontWeight: 700,
                  color: "#2A2018",
                  marginBottom: 8,
                  lineHeight: 1.1,
                }}
              >
                Skin Analysis
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: "#8A7060",
                  fontFamily: "'Jost',sans-serif",
                  lineHeight: 1.6,
                  maxWidth: 500,
                }}
              >
                Upload a close-up photo in natural light and let our AI decode
                your skin type, characteristics, and personalized
                recommendations.
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  analysisStage === "done" ? "1fr 1fr" : "1fr",
                gap: 20,
              }}
            >
              {/* Upload Panel — Guided Multi-Photo */}
              <div
                style={{
                  background: "rgba(255,255,255,0.7)",
                  backdropFilter: "blur(16px)",
                  border: "1px solid rgba(212,184,150,0.3)",
                  borderRadius: 24,
                  padding: 28,
                  boxShadow: "0 8px 40px rgba(160,110,80,0.1)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 6,
                  }}
                >
                  <div
                    style={{
                      fontSize: 10,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: "#B8A090",
                      fontFamily: "'Jost',sans-serif",
                      fontWeight: 600,
                    }}
                  >
                    Guided Photo Analysis
                  </div>
                  {photosUploaded > 0 && (
                    <span
                      style={{
                        fontSize: 11,
                        color: "#C8877A",
                        fontFamily: "'Jost',sans-serif",
                        fontWeight: 600,
                      }}
                    >
                      {photosUploaded}/5 photos
                    </span>
                  )}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: "#8A7060",
                    fontFamily: "'Jost',sans-serif",
                    lineHeight: 1.6,
                    marginBottom: 22,
                  }}
                >
                  For the most accurate analysis, take close-up photos of each
                  area below in natural light with no makeup.
                </div>

                {/* Photo tip banner */}
                <div
                  style={{
                    background:
                      "linear-gradient(135deg,rgba(200,135,122,0.08),rgba(212,184,150,0.1))",
                    border: "1px solid rgba(200,135,122,0.2)",
                    borderRadius: 14,
                    padding: "12px 16px",
                    marginBottom: 22,
                    display: "flex",
                    gap: 12,
                    alignItems: "flex-start",
                  }}
                >
                  <span style={{ fontSize: 18, flexShrink: 0 }}>💡</span>
                  <div
                    style={{
                      fontSize: 12,
                      color: "#8A7060",
                      fontFamily: "'Jost',sans-serif",
                      lineHeight: 1.6,
                    }}
                  >
                    <strong style={{ color: "#C8877A" }}>
                      Best results tip:
                    </strong>{" "}
                    Hold your phone 6–8 inches from your face. Use window light
                    facing you. Avoid flash, filters, or heavy skincare products
                    before shooting.
                  </div>
                </div>

                {/* Photo zone slots */}
                {(() => {
                  const slots = [
                    {
                      id: "forehead",
                      label: "Forehead",
                      emoji: "🧠",
                      tip: "Shows oiliness, fine lines, and pore size",
                      area: "Upper face",
                    },
                    {
                      id: "nose",
                      label: "Nose & T-Zone",
                      emoji: "👃",
                      tip: "Key area for blackheads, sebum, and pores",
                      area: "Centre face",
                    },
                    {
                      id: "leftCheek",
                      label: "Left Cheek",
                      emoji: "◧",
                      tip: "Reveals texture, redness, and dry patches",
                      area: "Left side",
                    },
                    {
                      id: "rightCheek",
                      label: "Right Cheek",
                      emoji: "◨",
                      tip: "Compare with left cheek for asymmetry",
                      area: "Right side",
                    },
                    {
                      id: "chin",
                      label: "Chin & Jawline",
                      emoji: "⬇️",
                      tip: "Hormonal breakout zone and jawline tone",
                      area: "Lower face",
                    },
                  ];
                  return (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 12,
                        marginBottom: 22,
                      }}
                    >
                      {slots.map((slot, i) => {
                        const hasPhoto = !!photoSlots[slot.id];
                        return (
                          <div
                            key={slot.id}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 14,
                              padding: "14px 16px",
                              background: hasPhoto
                                ? "rgba(200,135,122,0.06)"
                                : "rgba(255,255,255,0.5)",
                              border: `1.5px solid ${
                                hasPhoto
                                  ? "rgba(200,135,122,0.4)"
                                  : "rgba(212,184,150,0.3)"
                              }`,
                              borderRadius: 16,
                              transition: "all 0.2s",
                            }}
                          >
                            {/* Thumbnail or placeholder */}
                            <div
                              onClick={() => {
                                setActiveSlot(slot.id);
                                slotFileRef.current.click();
                              }}
                              style={{
                                width: 64,
                                height: 64,
                                borderRadius: 12,
                                overflow: "hidden",
                                flexShrink: 0,
                                cursor: "pointer",
                                border: `2px dashed ${
                                  hasPhoto
                                    ? "transparent"
                                    : "rgba(200,135,122,0.35)"
                                }`,
                                background: hasPhoto
                                  ? "transparent"
                                  : "rgba(200,135,122,0.05)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                transition: "all 0.2s",
                                position: "relative",
                              }}
                              onMouseEnter={(e) => {
                                if (!hasPhoto)
                                  e.currentTarget.style.background =
                                    "rgba(200,135,122,0.12)";
                              }}
                              onMouseLeave={(e) => {
                                if (!hasPhoto)
                                  e.currentTarget.style.background =
                                    "rgba(200,135,122,0.05)";
                              }}
                            >
                              {hasPhoto ? (
                                <>
                                  <img
                                    src={photoSlots[slot.id]}
                                    alt={slot.label}
                                    style={{
                                      width: "100%",
                                      height: "100%",
                                      objectFit: "cover",
                                    }}
                                  />
                                  <div
                                    style={{
                                      position: "absolute",
                                      inset: 0,
                                      background: "rgba(0,0,0,0)",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      borderRadius: 10,
                                      transition: "background 0.2s",
                                    }}
                                    onMouseEnter={(e) =>
                                      (e.currentTarget.style.background =
                                        "rgba(42,32,24,0.45)")
                                    }
                                    onMouseLeave={(e) =>
                                      (e.currentTarget.style.background =
                                        "rgba(0,0,0,0)")
                                    }
                                  >
                                    <span
                                      style={{
                                        color: "rgba(255,255,255,0)",
                                        fontSize: 18,
                                        transition: "color 0.2s",
                                      }}
                                      onMouseEnter={(e) =>
                                        (e.currentTarget.style.color =
                                          "rgba(255,255,255,1)")
                                      }
                                      onMouseLeave={(e) =>
                                        (e.currentTarget.style.color =
                                          "rgba(255,255,255,0)")
                                      }
                                    >
                                      ✎
                                    </span>
                                  </div>
                                </>
                              ) : (
                                <div style={{ textAlign: "center" }}>
                                  <div style={{ fontSize: 22 }}>
                                    {slot.emoji}
                                  </div>
                                  <div
                                    style={{
                                      fontSize: 9,
                                      color: "#C8877A",
                                      fontFamily: "'Jost',sans-serif",
                                      marginTop: 2,
                                    }}
                                  >
                                    + Add
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Labels */}
                            <div style={{ flex: 1 }}>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 8,
                                  marginBottom: 3,
                                }}
                              >
                                <div
                                  style={{
                                    fontFamily: "'Cormorant Garamond',serif",
                                    fontSize: 15,
                                    fontWeight: 700,
                                    color: "#2A2018",
                                  }}
                                >
                                  {slot.label}
                                </div>
                                {hasPhoto && (
                                  <span
                                    style={{
                                      fontSize: 9,
                                      background: "rgba(123,175,123,0.15)",
                                      color: "#7BAF7B",
                                      padding: "2px 8px",
                                      borderRadius: 10,
                                      fontFamily: "'Jost',sans-serif",
                                      fontWeight: 600,
                                      border: "1px solid rgba(123,175,123,0.3)",
                                    }}
                                  >
                                    ✓ Done
                                  </span>
                                )}
                              </div>
                              <div
                                style={{
                                  fontSize: 10,
                                  color: "#B8A090",
                                  fontFamily: "'Jost',sans-serif",
                                  marginBottom: 2,
                                  letterSpacing: "0.04em",
                                }}
                              >
                                {slot.area}
                              </div>
                              <div
                                style={{
                                  fontSize: 11,
                                  color: "#8A7060",
                                  fontFamily: "'Jost',sans-serif",
                                  lineHeight: 1.4,
                                }}
                              >
                                {slot.tip}
                              </div>
                            </div>

                            {/* Upload / Retake */}
                            <button
                              onClick={() => {
                                setActiveSlot(slot.id);
                                slotFileRef.current.click();
                              }}
                              style={{
                                padding: "8px 14px",
                                background: hasPhoto
                                  ? "transparent"
                                  : "linear-gradient(135deg,rgba(200,135,122,0.15),rgba(212,184,150,0.2))",
                                border: `1px solid ${
                                  hasPhoto
                                    ? "rgba(212,184,150,0.4)"
                                    : "rgba(200,135,122,0.4)"
                                }`,
                                borderRadius: 20,
                                cursor: "pointer",
                                fontSize: 11,
                                color: hasPhoto ? "#A09080" : "#C8877A",
                                fontFamily: "'Jost',sans-serif",
                                fontWeight: 600,
                                whiteSpace: "nowrap",
                                flexShrink: 0,
                                transition: "all 0.2s",
                              }}
                            >
                              {hasPhoto ? "Retake" : "Upload"}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}

                <input
                  ref={slotFileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleSlotUpload}
                  style={{ display: "none" }}
                />
                <input
                  ref={analysisFileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAnalysisUpload}
                  style={{ display: "none" }}
                />

                {/* Progress indicator */}
                {photosUploaded > 0 && analysisStage !== "done" && (
                  <div style={{ marginBottom: 16 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 6,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 11,
                          color: "#8A7060",
                          fontFamily: "'Jost',sans-serif",
                        }}
                      >
                        Photo coverage
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: "#C8877A",
                          fontFamily: "'Jost',sans-serif",
                          fontWeight: 600,
                        }}
                      >
                        {Math.round((photosUploaded / 5) * 100)}%
                      </div>
                    </div>
                    <div
                      style={{
                        height: 5,
                        background: "rgba(212,184,150,0.25)",
                        borderRadius: 10,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          background: "linear-gradient(90deg,#C8877A,#D4B896)",
                          width: `${(photosUploaded / 5) * 100}%`,
                          borderRadius: 10,
                          transition: "width 0.5s cubic-bezier(0.22,1,0.36,1)",
                        }}
                      />
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "#A09080",
                        fontFamily: "'Jost',sans-serif",
                        marginTop: 6,
                      }}
                    >
                      {photosUploaded < 3
                        ? `Add ${3 - photosUploaded} more photo${
                            3 - photosUploaded !== 1 ? "s" : ""
                          } for a basic analysis`
                        : photosUploaded < 5
                        ? "Looking good! Add all 5 for the most accurate result"
                        : "All zones captured — ready for full analysis!"}
                    </div>
                  </div>
                )}

                {/* Analyse button */}
                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    disabled={photosUploaded === 0 && analysisStage !== "done"}
                    onClick={() => {
                      if (photosUploaded > 0) runAnalysis(null);
                    }}
                    style={{
                      flex: 1,
                      padding: "13px 20px",
                      background:
                        photosUploaded > 0 || analysisStage === "done"
                          ? "linear-gradient(135deg,#C8877A,#D4956A)"
                          : "rgba(212,184,150,0.3)",
                      color:
                        photosUploaded > 0 || analysisStage === "done"
                          ? "#fff"
                          : "#B8A090",
                      border: "none",
                      borderRadius: 14,
                      cursor: photosUploaded > 0 ? "pointer" : "not-allowed",
                      fontSize: 13,
                      fontFamily: "'Jost',sans-serif",
                      fontWeight: 600,
                      letterSpacing: "0.06em",
                      boxShadow:
                        photosUploaded > 0
                          ? "0 4px 20px rgba(200,135,122,0.35)"
                          : "none",
                      transition: "all 0.3s",
                    }}
                  >
                    {analysisStage === "analyzing"
                      ? "Analysing..."
                      : analysisStage === "done"
                      ? "Re-analyse"
                      : photosUploaded === 0
                      ? "Upload photos to begin"
                      : `Analyse ${photosUploaded} Photo${
                          photosUploaded !== 1 ? "s" : ""
                        } →`}
                  </button>
                  {(photosUploaded > 0 || analysisStage === "done") && (
                    <button
                      onClick={resetAnalysis}
                      style={{
                        padding: "13px 18px",
                        background: "transparent",
                        color: "#A09080",
                        border: "1px solid rgba(212,184,150,0.4)",
                        borderRadius: 14,
                        cursor: "pointer",
                        fontSize: 13,
                        fontFamily: "'Jost',sans-serif",
                      }}
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Analyzing overlay state */}
                {analysisStage === "analyzing" && (
                  <div
                    className="fade-in"
                    style={{
                      marginTop: 20,
                      background: "rgba(42,32,24,0.04)",
                      border: "1px solid rgba(200,135,122,0.2)",
                      borderRadius: 16,
                      padding: "20px 20px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 10,
                      }}
                    >
                      <div
                        style={{
                          fontFamily: "'Cormorant Garamond',serif",
                          fontSize: 16,
                          fontWeight: 600,
                          color: "#2A2018",
                        }}
                      >
                        Analysing your skin...
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: "#C8877A",
                          fontFamily: "'Jost',sans-serif",
                          fontWeight: 600,
                        }}
                      >
                        {Math.round(analysisProgress)}%
                      </div>
                    </div>
                    <div
                      style={{
                        height: 6,
                        background: "rgba(212,184,150,0.2)",
                        borderRadius: 10,
                        overflow: "hidden",
                        marginBottom: 10,
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          background: "linear-gradient(90deg,#C8877A,#E8D080)",
                          borderRadius: 10,
                          width: `${analysisProgress}%`,
                          transition: "width 0.3s ease",
                        }}
                      />
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "#A09080",
                        fontFamily: "'Jost',sans-serif",
                        fontStyle: "italic",
                      }}
                    >
                      {analysisProgress < 25
                        ? "Mapping skin tone across zones..."
                        : analysisProgress < 50
                        ? "Analysing texture, pores & sebum..."
                        : analysisProgress < 75
                        ? "Identifying concerns & patterns..."
                        : "Generating your personalised report..."}
                    </div>
                  </div>
                )}

                {/* Manual fallback */}
                <div
                  style={{
                    borderTop: "1px solid rgba(212,184,150,0.3)",
                    paddingTop: 20,
                    marginTop: 20,
                  }}
                >
                  <div
                    style={{
                      fontSize: 10,
                      color: "#B8A090",
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      marginBottom: 14,
                      fontFamily: "'Jost',sans-serif",
                      fontWeight: 600,
                    }}
                  >
                    Or select your skin type manually
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {SKIN_TYPES.map((t) => (
                      <button
                        key={t}
                        onClick={() => {
                          setSkinType(t);
                          setAnalysisResult(t);
                          setAnalysisStage("done");
                        }}
                        style={{
                          padding: "9px 18px",
                          border: `1.5px solid ${
                            analysisResult === t
                              ? "rgba(200,135,122,0.8)"
                              : "rgba(212,184,150,0.35)"
                          }`,
                          background:
                            analysisResult === t
                              ? "linear-gradient(135deg,rgba(200,135,122,0.15),rgba(212,184,150,0.2))"
                              : "rgba(255,255,255,0.5)",
                          color: analysisResult === t ? "#C8877A" : "#8A7060",
                          borderRadius: 30,
                          cursor: "pointer",
                          fontSize: 12,
                          fontFamily: "'Jost',sans-serif",
                          fontWeight: analysisResult === t ? 600 : 400,
                          transition: "all 0.2s",
                        }}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Results */}
              {analysisStage === "done" && analysisData && (
                <div
                  className="fade-in"
                  style={{ display: "flex", flexDirection: "column", gap: 16 }}
                >
                  {/* Score card */}
                  <div
                    style={{
                      background: `linear-gradient(135deg,${analysisData.color}18,${analysisData.color}10)`,
                      border: `1px solid ${analysisData.color}30`,
                      borderRadius: 24,
                      padding: 24,
                      display: "flex",
                      alignItems: "center",
                      gap: 20,
                    }}
                  >
                    <div
                      style={{
                        position: "relative",
                        width: 90,
                        height: 90,
                        flexShrink: 0,
                      }}
                    >
                      <svg width="90" height="90" viewBox="0 0 90 90">
                        <circle
                          cx="45"
                          cy="45"
                          r="38"
                          fill="none"
                          stroke={`${analysisData.color}22`}
                          strokeWidth="7"
                        />
                        <circle
                          cx="45"
                          cy="45"
                          r="38"
                          fill="none"
                          stroke={analysisData.color}
                          strokeWidth="7"
                          strokeLinecap="round"
                          style={{
                            strokeDasharray: 239,
                            strokeDashoffset:
                              239 - (239 * analysisData.score) / 100,
                            transform: "rotate(-90deg)",
                            transformOrigin: "50% 50%",
                            transition:
                              "stroke-dashoffset 1.2s cubic-bezier(0.22,1,0.36,1)",
                          }}
                        />
                      </svg>
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <div
                          style={{
                            fontFamily: "'Cormorant Garamond',serif",
                            fontSize: 26,
                            fontWeight: 700,
                            color: analysisData.color,
                            lineHeight: 1,
                          }}
                        >
                          {analysisData.score}
                        </div>
                        <div
                          style={{
                            fontSize: 8,
                            color: "#B8A090",
                            letterSpacing: "0.1em",
                            fontFamily: "'Jost',sans-serif",
                            fontWeight: 600,
                          }}
                        >
                          SCORE
                        </div>
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: 10,
                          letterSpacing: "0.16em",
                          textTransform: "uppercase",
                          color: "#B8A090",
                          marginBottom: 4,
                          fontFamily: "'Jost',sans-serif",
                          fontWeight: 600,
                        }}
                      >
                        Skin Health Score
                      </div>
                      <div
                        style={{
                          fontFamily: "'Cormorant Garamond',serif",
                          fontSize: 24,
                          fontWeight: 700,
                          color: "#2A2018",
                          marginBottom: 4,
                        }}
                      >
                        {analysisResult} Skin
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: "#A09080",
                          fontFamily: "'Jost',sans-serif",
                        }}
                      >
                        Based on{" "}
                        {photosUploaded > 0
                          ? `${photosUploaded} photo${
                              photosUploaded !== 1 ? "s" : ""
                            } analysed`
                          : skinType
                          ? "self-reported type"
                          : "analysis"}
                      </div>
                    </div>
                  </div>

                  {/* Characteristics */}
                  <div
                    style={{
                      background: "rgba(255,255,255,0.7)",
                      backdropFilter: "blur(16px)",
                      border: "1px solid rgba(212,184,150,0.3)",
                      borderRadius: 20,
                      padding: 22,
                      boxShadow: "0 4px 20px rgba(160,110,80,0.08)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 10,
                        letterSpacing: "0.16em",
                        textTransform: "uppercase",
                        color: "#B8A090",
                        marginBottom: 16,
                        fontFamily: "'Jost',sans-serif",
                        fontWeight: 600,
                      }}
                    >
                      Characteristics
                    </div>
                    {analysisData.characteristics.map((c, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          marginBottom: 10,
                          fontSize: 13,
                          fontFamily: "'Jost',sans-serif",
                          color: "#4A3828",
                        }}
                      >
                        <div
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: analysisData.color,
                            flexShrink: 0,
                          }}
                        />
                        {c}
                      </div>
                    ))}
                  </div>

                  {/* Concerns */}
                  <div
                    style={{
                      background: "rgba(255,255,255,0.7)",
                      backdropFilter: "blur(16px)",
                      border: `1px solid rgba(212,184,150,0.3)`,
                      borderLeft: `3px solid ${analysisData.color}`,
                      borderRadius: 20,
                      padding: 22,
                      boxShadow: "0 4px 20px rgba(160,110,80,0.08)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 10,
                        letterSpacing: "0.16em",
                        textTransform: "uppercase",
                        color: "#B8A090",
                        marginBottom: 16,
                        fontFamily: "'Jost',sans-serif",
                        fontWeight: 600,
                      }}
                    >
                      Key Concerns
                    </div>
                    {analysisData.concerns.map((c, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          marginBottom: 10,
                          fontSize: 13,
                          fontFamily: "'Jost',sans-serif",
                          color: "#4A3828",
                        }}
                      >
                        <div
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: "rgba(200,135,122,0.7)",
                            flexShrink: 0,
                          }}
                        />
                        {c}
                      </div>
                    ))}
                    <button
                      onClick={() => setActiveTab("chat")}
                      style={{
                        marginTop: 14,
                        width: "100%",
                        padding: 13,
                        background: "linear-gradient(135deg,#C8877A,#D4956A)",
                        color: "#fff",
                        border: "none",
                        borderRadius: 12,
                        cursor: "pointer",
                        fontSize: 12,
                        fontFamily: "'Jost',sans-serif",
                        fontWeight: 600,
                        letterSpacing: "0.06em",
                        boxShadow: "0 4px 16px rgba(200,135,122,0.3)",
                      }}
                    >
                      Ask Sora for Recommendations →
                    </button>
                  </div>

                  {/* Product picks */}
                  <div
                    style={{
                      background: "rgba(255,255,255,0.7)",
                      backdropFilter: "blur(16px)",
                      border: "1px solid rgba(212,184,150,0.3)",
                      borderRadius: 20,
                      padding: 22,
                      boxShadow: "0 4px 20px rgba(160,110,80,0.08)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 10,
                        letterSpacing: "0.16em",
                        textTransform: "uppercase",
                        color: "#B8A090",
                        marginBottom: 16,
                        fontFamily: "'Jost',sans-serif",
                        fontWeight: 600,
                      }}
                    >
                      Top Picks for {analysisResult} Skin
                    </div>
                    <div className="hscroll">
                      {PRODUCTS_DB.filter((p) =>
                        p.skinTypes.includes(analysisResult)
                      )
                        .slice(0, 4)
                        .map((item) => (
                          <ItemCard key={item.id} item={item} />
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══════════════ PROFILE TAB ══════════════ */}
        {activeTab === "profile" && (
          <div
            className="fade-in"
            style={{ padding: "32px 24px", maxWidth: 960, margin: "0 auto" }}
          >
            {/* Profile hero */}
            <div
              style={{
                background:
                  "linear-gradient(135deg,rgba(200,135,122,0.18),rgba(212,184,150,0.22))",
                border: "1px solid rgba(212,184,150,0.3)",
                borderRadius: 28,
                padding: "32px 36px",
                marginBottom: 28,
                display: "flex",
                alignItems: "center",
                gap: 22,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  right: -30,
                  top: -30,
                  width: 200,
                  height: 200,
                  background: "rgba(255,255,255,0.15)",
                  borderRadius: "50%",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  right: 80,
                  bottom: -50,
                  width: 120,
                  height: 120,
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: "50%",
                }}
              />
              <div
                style={{
                  width: 72,
                  height: 72,
                  background:
                    "linear-gradient(135deg,rgba(200,135,122,0.25),rgba(212,184,150,0.35))",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 32,
                  border: "2px solid rgba(200,135,122,0.3)",
                  flexShrink: 0,
                  backdropFilter: "blur(8px)",
                }}
              >
                🌸
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "'Cormorant Garamond',serif",
                    color: "#2A2018",
                    fontSize: 26,
                    fontWeight: 700,
                    marginBottom: 4,
                  }}
                >
                  My Skin Profile
                </div>
                {skinType ? (
                  <div
                    style={{
                      color: "#7BAF7B",
                      fontSize: 13,
                      fontFamily: "'Jost',sans-serif",
                      marginBottom: 4,
                    }}
                  >
                    ✓ {skinType} skin · Analysis complete
                  </div>
                ) : (
                  <div
                    style={{
                      color: "#A09080",
                      fontSize: 13,
                      fontFamily: "'Jost',sans-serif",
                      marginBottom: 4,
                    }}
                  >
                    Complete an analysis to personalize your profile
                  </div>
                )}
                <div
                  style={{
                    color: "#B8A090",
                    fontSize: 11,
                    fontFamily: "'Jost',sans-serif",
                  }}
                >
                  {collections.reduce((a, c) => a + c.items.length, 0)} saved
                  items · {collections.length} collections
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              {activeCollection ? (
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <button
                    onClick={() => setActiveCollection(null)}
                    style={{
                      background: "rgba(255,255,255,0.7)",
                      border: "1px solid rgba(212,184,150,0.3)",
                      borderRadius: 12,
                      padding: "8px 16px",
                      cursor: "pointer",
                      fontSize: 12,
                      fontFamily: "'Jost',sans-serif",
                      color: "#8A7060",
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    ← Back
                  </button>
                  <div
                    style={{
                      fontFamily: "'Cormorant Garamond',serif",
                      fontSize: 24,
                      fontWeight: 700,
                      color: "#2A2018",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <span>
                      {
                        collections.find((c) => c.id === activeCollection)
                          ?.emoji
                      }
                    </span>
                    <span>
                      {collections.find((c) => c.id === activeCollection)?.name}
                    </span>
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    fontFamily: "'Cormorant Garamond',serif",
                    fontSize: 28,
                    fontWeight: 700,
                    color: "#2A2018",
                  }}
                >
                  My Collections
                </div>
              )}
              {!activeCollection && (
                <button
                  onClick={() => setShowCreateFolder(true)}
                  style={{
                    padding: "10px 22px",
                    background: "linear-gradient(135deg,#C8877A,#D4956A)",
                    color: "#fff",
                    border: "none",
                    borderRadius: 24,
                    cursor: "pointer",
                    fontSize: 12,
                    fontFamily: "'Jost',sans-serif",
                    fontWeight: 600,
                    boxShadow: "0 4px 16px rgba(200,135,122,0.3)",
                    letterSpacing: "0.04em",
                  }}
                >
                  + New Collection
                </button>
              )}
            </div>

            {!activeCollection ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))",
                  gap: 16,
                }}
              >
                {collections.map((col, i) => (
                  <div
                    key={col.id}
                    className="col-card"
                    onClick={() => setActiveCollection(col.id)}
                    style={{
                      background: "rgba(255,255,255,0.75)",
                      backdropFilter: "blur(16px)",
                      border: "1px solid rgba(212,184,150,0.3)",
                      borderRadius: 22,
                      padding: "26px 22px",
                      boxShadow: "0 4px 24px rgba(160,110,80,0.08)",
                      cursor: "pointer",
                      animationDelay: `${i * 0.05}s`,
                    }}
                  >
                    <div style={{ fontSize: 40, marginBottom: 14 }}>
                      {col.emoji}
                    </div>
                    <div
                      style={{
                        fontFamily: "'Cormorant Garamond',serif",
                        fontSize: 17,
                        fontWeight: 700,
                        marginBottom: 4,
                        color: "#2A2018",
                      }}
                    >
                      {col.name}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "#A09080",
                        fontFamily: "'Jost',sans-serif",
                      }}
                    >
                      {col.items.length}{" "}
                      {col.items.length === 1 ? "item" : "items"}
                    </div>
                    {col.items.length > 0 && (
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 4,
                          marginTop: 14,
                        }}
                      >
                        {col.items.slice(0, 3).map((item) => (
                          <span
                            key={item.id}
                            style={{
                              fontSize: 10,
                              padding: "3px 8px",
                              background: "rgba(200,135,122,0.1)",
                              border: "1px solid rgba(200,135,122,0.2)",
                              borderRadius: 8,
                              color: "#C8877A",
                              fontFamily: "'Jost',sans-serif",
                            }}
                          >
                            {item.name.split(" ").slice(0, 2).join(" ")}
                          </span>
                        ))}
                        {col.items.length > 3 && (
                          <span style={{ fontSize: 10, color: "#B8A090" }}>
                            +{col.items.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                <div
                  className="col-card"
                  onClick={() => setShowCreateFolder(true)}
                  style={{
                    background: "transparent",
                    border: "2px dashed rgba(200,135,122,0.25)",
                    borderRadius: 22,
                    padding: "26px 22px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: 140,
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      fontSize: 32,
                      color: "rgba(200,135,122,0.4)",
                      marginBottom: 8,
                    }}
                  >
                    +
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "#B8A090",
                      fontFamily: "'Jost',sans-serif",
                    }}
                  >
                    New Collection
                  </div>
                </div>
              </div>
            ) : (
              <div className="fade-in">
                {(() => {
                  const col = collections.find(
                    (c) => c.id === activeCollection
                  );
                  return col.items.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "80px 20px" }}>
                      <div style={{ fontSize: 64, marginBottom: 16 }}>
                        {col.emoji}
                      </div>
                      <div
                        style={{
                          fontFamily: "'Cormorant Garamond',serif",
                          fontSize: 22,
                          marginBottom: 8,
                          color: "#2A2018",
                          fontWeight: 600,
                        }}
                      >
                        This collection is empty
                      </div>
                      <div
                        style={{
                          fontSize: 14,
                          color: "#A09080",
                          marginBottom: 28,
                          fontFamily: "'Jost',sans-serif",
                        }}
                      >
                        Star products or ingredients in Chat to save them here.
                      </div>
                      <button
                        onClick={() => {
                          setActiveTab("chat");
                          setActiveCollection(null);
                        }}
                        style={{
                          padding: "12px 28px",
                          background: "linear-gradient(135deg,#C8877A,#D4956A)",
                          color: "#fff",
                          border: "none",
                          borderRadius: 24,
                          cursor: "pointer",
                          fontSize: 13,
                          fontFamily: "'Jost',sans-serif",
                          fontWeight: 600,
                          boxShadow: "0 4px 16px rgba(200,135,122,0.3)",
                        }}
                      >
                        Go to Chat →
                      </button>
                    </div>
                  ) : (
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fill,minmax(260px,1fr))",
                        gap: 16,
                      }}
                    >
                      {col.items.map((item) => (
                        <div
                          key={item.id}
                          style={{
                            background: "rgba(255,255,255,0.75)",
                            backdropFilter: "blur(16px)",
                            border: "1px solid rgba(212,184,150,0.3)",
                            borderRadius: 20,
                            padding: 22,
                            position: "relative",
                            boxShadow: "0 4px 20px rgba(160,110,80,0.08)",
                          }}
                        >
                          <button
                            onClick={() =>
                              removeFromCollection(col.id, item.id)
                            }
                            style={{
                              position: "absolute",
                              top: 14,
                              right: 14,
                              background: "rgba(212,184,150,0.2)",
                              border: "none",
                              cursor: "pointer",
                              fontSize: 14,
                              color: "#A09080",
                              width: 28,
                              height: 28,
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            ×
                          </button>
                          <div
                            style={{
                              fontSize: 9,
                              letterSpacing: "0.14em",
                              textTransform: "uppercase",
                              color: "#B8A090",
                              marginBottom: 8,
                              fontFamily: "'Jost',sans-serif",
                              fontWeight: 600,
                            }}
                          >
                            {item.type === "product"
                              ? "Product"
                              : item.category}
                          </div>
                          <div
                            style={{
                              fontFamily: "'Cormorant Garamond',serif",
                              fontSize: 17,
                              fontWeight: 700,
                              marginBottom: 4,
                              color: "#2A2018",
                            }}
                          >
                            {item.name}
                          </div>
                          <div
                            style={{
                              fontSize: 11,
                              color: "#A09080",
                              marginBottom: 10,
                              fontFamily: "'Jost',sans-serif",
                            }}
                          >
                            {item.brand}
                          </div>
                          <div
                            style={{
                              fontSize: 12,
                              color: "#6A5A4A",
                              lineHeight: 1.6,
                              fontFamily: "'Jost',sans-serif",
                            }}
                          >
                            {item.description?.slice(0, 90)}...
                          </div>
                          {item.type === "product" && (
                            <div
                              style={{
                                marginTop: 12,
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <span
                                style={{
                                  fontFamily: "'Cormorant Garamond',serif",
                                  fontWeight: 700,
                                  fontSize: 16,
                                  color: "#2A2018",
                                }}
                              >
                                {item.price}
                              </span>
                              <div>
                                {[1, 2, 3, 4, 5].map((s) => (
                                  <span
                                    key={s}
                                    style={{
                                      color:
                                        s <= Math.round(item.rating)
                                          ? "#E8B84B"
                                          : "#E0D5C8",
                                      fontSize: 12,
                                    }}
                                  >
                                    ★
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          {item.tag && (
                            <span
                              style={{
                                display: "inline-block",
                                marginTop: 12,
                                fontSize: 9,
                                padding: "4px 10px",
                                background:
                                  "linear-gradient(135deg,rgba(200,135,122,0.15),rgba(212,184,150,0.15))",
                                color: "#C8877A",
                                borderRadius: 12,
                                fontFamily: "'Jost',sans-serif",
                                fontWeight: 600,
                                letterSpacing: "0.1em",
                                textTransform: "uppercase",
                                border: "1px solid rgba(200,135,122,0.25)",
                              }}
                            >
                              {item.tag}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )}

        {/* ══════════════ ROUTINE TAB ══════════════ */}
        {activeTab === "routine" && (
          <div
            className="fade-in"
            style={{ padding: "32px 24px", maxWidth: 860, margin: "0 auto" }}
          >
            <div
              style={{
                fontFamily: "'Cormorant Garamond',serif",
                fontSize: 34,
                fontWeight: 700,
                color: "#2A2018",
                marginBottom: 6,
              }}
            >
              My Routine
            </div>
            <div
              style={{
                fontSize: 14,
                color: "#8A7060",
                marginBottom: 28,
                fontFamily: "'Jost',sans-serif",
              }}
            >
              Track your daily skincare steps and build lasting habits.
            </div>

            {/* AM/PM toggle */}
            <div
              style={{
                display: "inline-flex",
                background: "rgba(255,255,255,0.6)",
                border: "1px solid rgba(212,184,150,0.3)",
                borderRadius: 20,
                padding: 4,
                marginBottom: 28,
                backdropFilter: "blur(10px)",
              }}
            >
              {["AM", "PM"].map((t) => (
                <button
                  key={t}
                  onClick={() => setRoutineTime(t)}
                  style={{
                    padding: "10px 32px",
                    background:
                      routineTime === t
                        ? "linear-gradient(135deg,#C8877A,#D4956A)"
                        : "transparent",
                    color: routineTime === t ? "#fff" : "#8A7060",
                    border: "none",
                    borderRadius: 16,
                    cursor: "pointer",
                    fontSize: 13,
                    fontFamily: "'Jost',sans-serif",
                    fontWeight: routineTime === t ? 600 : 400,
                    transition: "all 0.3s cubic-bezier(0.22,1,0.36,1)",
                    boxShadow:
                      routineTime === t
                        ? "0 4px 16px rgba(200,135,122,0.35)"
                        : "none",
                  }}
                >
                  {t === "AM" ? "☀ Morning" : "☽ Evening"}
                </button>
              ))}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 280px",
                gap: 20,
              }}
            >
              {/* Steps list */}
              <div
                style={{
                  background: "rgba(255,255,255,0.7)",
                  backdropFilter: "blur(16px)",
                  border: "1px solid rgba(212,184,150,0.3)",
                  borderRadius: 24,
                  overflow: "hidden",
                  boxShadow: "0 8px 40px rgba(160,110,80,0.1)",
                }}
              >
                {ROUTINE_STEPS.map((step, i) => {
                  const filled = routine[routineTime][step];
                  const done = completedSteps[routineTime][step];
                  return (
                    <div
                      key={step}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 14,
                        padding: "15px 20px",
                        borderBottom:
                          i < ROUTINE_STEPS.length - 1
                            ? "1px solid rgba(212,184,150,0.15)"
                            : "none",
                        background: done
                          ? "rgba(200,135,122,0.04)"
                          : "transparent",
                        opacity: done ? 0.55 : 1,
                        transition: "all 0.2s",
                      }}
                    >
                      <div
                        onClick={() =>
                          filled &&
                          setCompletedSteps((prev) => ({
                            ...prev,
                            [routineTime]: {
                              ...prev[routineTime],
                              [step]: !prev[routineTime][step],
                            },
                          }))
                        }
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: "50%",
                          border: `2px solid ${
                            done
                              ? "#C8877A"
                              : filled
                              ? "rgba(200,135,122,0.6)"
                              : "rgba(212,184,150,0.4)"
                          }`,
                          background: done
                            ? "linear-gradient(135deg,#C8877A,#D4956A)"
                            : "transparent",
                          cursor: filled ? "pointer" : "default",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          transition: "all 0.25s",
                          boxShadow: done
                            ? "0 2px 10px rgba(200,135,122,0.4)"
                            : "none",
                        }}
                      >
                        {done && (
                          <span
                            style={{
                              color: "#fff",
                              fontSize: 11,
                              fontWeight: 700,
                            }}
                          >
                            ✓
                          </span>
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: done ? 400 : 500,
                            fontFamily: "'Jost',sans-serif",
                            color: "#2A2018",
                            textDecoration: done ? "line-through" : "none",
                          }}
                        >
                          {i + 1}. {step}
                        </div>
                        {filled && (
                          <div
                            style={{
                              fontSize: 11,
                              color: "#C8877A",
                              marginTop: 2,
                              fontFamily: "'Jost',sans-serif",
                              fontStyle: "italic",
                            }}
                          >
                            {filled}
                          </div>
                        )}
                      </div>
                      <input
                        placeholder="Add product..."
                        value={routine[routineTime][step] || ""}
                        onChange={(e) =>
                          setRoutine((prev) => ({
                            ...prev,
                            [routineTime]: {
                              ...prev[routineTime],
                              [step]: e.target.value,
                            },
                          }))
                        }
                        style={{
                          padding: "7px 14px",
                          border: "1px solid rgba(212,184,150,0.35)",
                          borderRadius: 20,
                          fontSize: 12,
                          width: 148,
                          fontFamily: "'Jost',sans-serif",
                          background: "rgba(255,255,255,0.6)",
                          color: "#2A2018",
                          backdropFilter: "blur(4px)",
                        }}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Progress + tips */}
              <div
                style={{ display: "flex", flexDirection: "column", gap: 14 }}
              >
                {["AM", "PM"].map((t) => {
                  const total = Object.values(routine[t]).filter(
                    Boolean
                  ).length;
                  const done = Object.values(completedSteps[t]).filter(
                    Boolean
                  ).length;
                  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
                  return (
                    <div
                      key={t}
                      style={{
                        background: "rgba(255,255,255,0.7)",
                        backdropFilter: "blur(16px)",
                        border: "1px solid rgba(212,184,150,0.3)",
                        borderRadius: 18,
                        padding: 20,
                        boxShadow: "0 4px 20px rgba(160,110,80,0.08)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: 12,
                        }}
                      >
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 500,
                            fontFamily: "'Jost',sans-serif",
                            color: "#2A2018",
                          }}
                        >
                          {t === "AM" ? "☀ Morning" : "☽ Evening"}
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color: "#B8A090",
                            fontFamily: "'Jost',sans-serif",
                          }}
                        >
                          {done}/{total} steps
                        </div>
                      </div>
                      <div
                        style={{
                          height: 6,
                          background: "rgba(212,184,150,0.25)",
                          borderRadius: 10,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            background:
                              pct === 100
                                ? "linear-gradient(90deg,#7BAF7B,#A8D8A8)"
                                : "linear-gradient(90deg,#C8877A,#D4B896)",
                            width: `${pct}%`,
                            borderRadius: 10,
                            transition:
                              "width 0.6s cubic-bezier(0.22,1,0.36,1)",
                          }}
                        />
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          marginTop: 8,
                          color: pct === 100 ? "#7BAF7B" : "#B8A090",
                          fontFamily: "'Jost',sans-serif",
                          fontStyle: pct === 100 ? "normal" : "italic",
                        }}
                      >
                        {pct === 100
                          ? "✓ Routine complete!"
                          : total === 0
                          ? "Add products to start tracking"
                          : `${pct}% complete`}
                      </div>
                    </div>
                  );
                })}

                {/* Tip card */}
                <div
                  style={{
                    background:
                      "linear-gradient(135deg,rgba(200,135,122,0.18),rgba(212,184,150,0.22))",
                    border: "1px solid rgba(212,184,150,0.3)",
                    borderRadius: 18,
                    padding: 22,
                  }}
                >
                  <div
                    style={{
                      fontSize: 9,
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      color: "rgba(200,135,122,0.8)",
                      marginBottom: 8,
                      fontFamily: "'Jost',sans-serif",
                      fontWeight: 600,
                    }}
                  >
                    Sora's Tip
                  </div>
                  <div
                    style={{
                      fontFamily: "'Cormorant Garamond',serif",
                      color: "#2A2018",
                      fontSize: 16,
                      fontWeight: 600,
                      marginBottom: 8,
                    }}
                  >
                    {routineTime === "AM"
                      ? "Never Skip Sunscreen ☀️"
                      : "Let Actives Work Overnight 🌙"}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "#8A7060",
                      lineHeight: 1.7,
                      fontFamily: "'Jost',sans-serif",
                    }}
                  >
                    {routineTime === "AM"
                      ? "UV protection is the single most evidence-backed anti-aging step. Apply SPF 30+ every single morning, rain or shine."
                      : "Night is when your skin regenerates. Apply retinol, acids, or peptides in your PM routine to maximize their effectiveness."}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
