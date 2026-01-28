export function calculateRisks(profile){
  let cardioRisk=10, diabetesRisk=8, oxidativeRisk=12;
  if(profile.age>50){cardioRisk+=15;diabetesRisk+=10;oxidativeRisk+=8;}
  else if(profile.age>40){cardioRisk+=8;diabetesRisk+=5;oxidativeRisk+=4;}
  const h=profile.height/100; const bmi=profile.weight/(h*h);
  if(bmi>30){cardioRisk+=20;diabetesRisk+=25;oxidativeRisk+=15;}
  else if(bmi>25){cardioRisk+=10;diabetesRisk+=15;oxidativeRisk+=8;}
  if(profile.smoking){cardioRisk+=25;oxidativeRisk+=30;}
  if(profile.alcohol==='heavy'){cardioRisk+=15;oxidativeRisk+=20;}
  else if(profile.alcohol==='regular'){cardioRisk+=8;oxidativeRisk+=10;}
  cardioRisk-=Math.min(profile.exercise*2,15);
  diabetesRisk-=Math.min(profile.exercise*2,12);
  oxidativeRisk-=Math.min(profile.exercise*1.5,10);
  diabetesRisk-=Math.min((profile.diet_quality-5)*3,15);
  cardioRisk-=Math.min((profile.diet_quality-5)*2,10);
  if(profile.sleep_hours<6||profile.sleep_hours>9){cardioRisk+=8;diabetesRisk+=6;oxidativeRisk+=10;}
  cardioRisk+=Math.max((profile.stress_level-5)*2,0);
  oxidativeRisk+=Math.max((profile.stress_level-5)*3,0);
  if(profile.family_heart) cardioRisk+=15;
  if(profile.family_diabetes) diabetesRisk+=20;
  if(profile.family_cancer) oxidativeRisk+=10;
  if(profile.blood_pressure==='high_2') cardioRisk+=20;
  else if(profile.blood_pressure==='high_1') cardioRisk+=12;
  else if(profile.blood_pressure==='elevated') cardioRisk+=5;
  if(profile.cholesterol==='high') cardioRisk+=15;
  else if(profile.cholesterol==='borderline') cardioRisk+=8;
  return {cardio:clamp(Math.round(cardioRisk),5,95),diabetes:clamp(Math.round(diabetesRisk),5,95),oxidative:clamp(Math.round(oxidativeRisk),5,95),bmi:Math.round(bmi*10)/10};
}
export function getRiskFactors(profile){
  const factors=[]; const h=profile.height/100; const bmi=profile.weight/(h*h);
  if(profile.smoking) factors.push({name:'التدخين',impact:'مرتفع',color:'red',description:'التدخين عامل خطر قلبي وعائي مهم قابل للتعديل.'});
  if(bmi>25) factors.push({name:'زيادة الوزن/السمنة',impact:bmi>30?'مرتفع':'متوسط',color:bmi>30?'red':'amber',description:`مؤشر كتلة جسمك ${bmi.toFixed(1)} يزيد مخاطر السكري وأمراض القلب.`});
  if(profile.exercise<3) factors.push({name:'قلة الحركة',impact:'متوسط',color:'amber',description:'أقل من 3 ساعات نشاط أسبوعياً يزيد المخاطر.'});
  if(profile.stress_level>=7) factors.push({name:'التوتر المزمن',impact:'متوسط',color:'amber',description:'التوتر المرتفع يؤثر على الصحة القلبية والمناعة.'});
  if(profile.diet_quality<5) factors.push({name:'التغذية',impact:'متوسط',color:'orange',description:'التغذية غير المتوازنة تزيد خطر السكري.'});
  if(profile.family_heart||profile.family_diabetes) factors.push({name:'التاريخ العائلي',impact:'غير قابل للتعديل',color:'purple',description:'العامل الوراثي يجعل الوقاية أكثر أهمية.'});
  if(!factors.length) factors.push({name:'ملف إيجابي',impact:'جيد',color:'green',description:'عاداتك الحالية إيجابية بشكل عام. استمر!'});
  return factors;
}
function clamp(v,min,max){return Math.max(min,Math.min(max,v));}
