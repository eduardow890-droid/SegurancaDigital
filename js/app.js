var ICONS={c:['🧱','🎣','⚖️','🔑'],l:['📨','🔐','🗂️','🚨']};
// Abas
document.querySelectorAll('[data-tabs]').forEach(function(t){
  var key=t.dataset.tabs, btns=t.querySelectorAll('button'), panes=document.querySelectorAll('[data-pane="'+key+'"]');
  btns.forEach(function(b,i){if(ICONS[key])b.textContent=ICONS[key][i]+' '+b.textContent;b.addEventListener('click',function(){
    btns.forEach(function(x,j){x.setAttribute('aria-selected',i===j);panes[j].hidden=i!==j;});
  });});
});

// Mini-quiz reutilizável (conteúdo sempre via textContent)
function el(tag,txt,cls){var e=document.createElement(tag);if(txt)e.textContent=txt;if(cls){e.className=cls;if(cls.indexOf('fb')===0)e.setAttribute('role','status');}return e;}
function makeQuiz(box,title,items,intro,cb){
  var i=0,score=0;
  function show(){
    box.textContent='';
    if(i>=items.length){
      if(cb)cb(score,items.length);box.appendChild(el('h3','Resultado: '+score+' de '+items.length));
      box.appendChild(el('p',score===items.length?'Excelente! Você acertou tudo.':score>=items.length/2?'Bom resultado. Revise as explicações dos erros.':'Vale refazer e ler os conceitos acima.','meta'));
      var r=el('button','Refazer','btn');r.onclick=function(){i=0;score=0;show();};box.appendChild(r);return;
    }
    var it=items[i];
    box.appendChild(el('h3',title+' '+(i+1)+'/'+items.length));
    if(intro)box.appendChild(el('p',intro,'meta'));
    if(it.msg)box.appendChild(el('div',it.msg,'msg'));
    box.appendChild(el('p',it.q));
    var o=el('div','','opts');
    it.o.forEach(function(t,k){
      var b=el('button',t,'btn alt');
      b.onclick=function(){
        var ok=k===it.a;if(ok)score++;
        o.querySelectorAll('button').forEach(function(x){x.disabled=true;});
        box.appendChild(el('div',(ok?'Correto. ':'Não foi dessa vez. ')+it.w,'fb '+(ok?'ok':'no')));
        var n=el('button',i+1<items.length?'Próxima':'Ver resultado','btn');n.style.marginTop='12px';
        n.onclick=function(){i++;show();};box.appendChild(n);n.focus();
      };o.appendChild(b);
    });
    box.appendChild(o);
  }
  show();
}


makeQuiz(document.getElementById('classif'),'Classificador de dados',[
 {q:'CPF de uma pessoa:',o:['Dado pessoal','Dado pessoal sensível','Não é dado pessoal'],a:0,w:'Identifica diretamente o titular, mas não está na lista de dados sensíveis.'},
 {q:'Laudo médico com diagnóstico:',o:['Dado pessoal','Dado pessoal sensível','Não é dado pessoal'],a:1,w:'Dado de saúde é sensível pela LGPD e exige cuidado reforçado.'},
 {q:'Impressão digital usada para liberar acesso:',o:['Dado pessoal','Dado pessoal sensível','Não é dado pessoal'],a:1,w:'Dado biométrico vinculado a uma pessoa é sensível.'},
 {q:'Faturamento anual consolidado de uma empresa:',o:['Dado pessoal','Dado pessoal sensível','Não é dado pessoal'],a:2,w:'Informação de pessoa jurídica, sem identificar uma pessoa natural, não é dado pessoal.'},
 {q:'E-mail pessoal de um cliente:',o:['Dado pessoal','Dado pessoal sensível','Não é dado pessoal'],a:0,w:'Permite identificar ou contatar uma pessoa, então é dado pessoal.'},
 {q:'Filiação a um sindicato:',o:['Dado pessoal','Dado pessoal sensível','Não é dado pessoal'],a:1,w:'Filiação a sindicato aparece expressamente entre os dados sensíveis.'}
],'Escolha a classificação segundo a LGPD.',function(s,t){prog('class',s,t);});


makeQuiz(document.getElementById('quizbox'),'Pergunta',[
 {q:'Qual princípio garante que a informação não foi alterada indevidamente?',o:['Confidencialidade','Integridade','Disponibilidade'],a:1,w:'Integridade protege contra alterações não autorizadas.'},
 {q:'Qual destes é um dado pessoal sensível?',o:['Nome completo','Endereço de e-mail','Dado de saúde'],a:2,w:'Saúde está entre os dados sensíveis da LGPD.'},
 {q:'Qual é o melhor complemento a uma senha forte?',o:['Autenticação em dois fatores','Anotar a senha em um post-it','Usar a mesma senha em todo lugar'],a:0,w:'O segundo fator protege mesmo se a senha vazar.'},
 {q:'Um backup só é confiável se:',o:['Ficar no mesmo computador','Estiver separado e a restauração for testada','For feito uma vez por ano'],a:1,w:'Backup sem teste de restauração é uma aposta.'},
 {q:'Quem pode pedir a correção de dados incompletos ou desatualizados?',o:['Somente a empresa','O titular dos dados','Apenas a ANPD'],a:1,w:'A correção é um direito do titular previsto na LGPD.'}
],'',function(s,t){prog('quiz',s,t);});

// Avaliador de senhas (local)
var pw=document.getElementById('pw'),bar=document.getElementById('pwbar'),res=document.getElementById('pwres'),chk=document.getElementById('pwchk');
var comuns=['123456','12345678','password','senha','qwerty','abc123','111111','admin','brasil','123123','iloveyou','letmein'];
pw.addEventListener('input',function(){
  var v=pw.value,pool=0;
  if(/[a-z]/.test(v))pool+=26;if(/[A-Z]/.test(v))pool+=26;if(/\d/.test(v))pool+=10;if(/[^A-Za-z0-9]/.test(v))pool+=32;
  var common=comuns.some(function(c){return v.toLowerCase().indexOf(c)>-1;});
  var bits=v?Math.log2(pool||1)*v.length:0;
  if(/(.)\1{2,}/.test(v))bits*=.8;
  if(common)bits=Math.min(bits,20);
  var lvl=!v?0:bits<28?1:bits<45?2:bits<65?3:4;
  var names=['','Muito fraca','Fraca','Boa','Forte'],cols=['','#ff7a7a','#ffb36b','#ffd166','#5be3a0'];
  bar.style.width=(lvl*25)+'%';bar.style.background=cols[lvl]||'transparent';
  res.textContent=!v?'Comece a digitar.':names[lvl]+' (cerca de '+Math.round(bits)+' bits de entropia estimada)'+(common?'. Contém padrão muito comum.':'.');
  pwtime.textContent=v?'Tempo para quebrar: '+ht(Math.pow(2,bits)/2e10):'';
  var rules=[['Pelo menos 12 caracteres',v.length>=12],['Maiúsculas e minúsculas',/[a-z]/.test(v)&&/[A-Z]/.test(v)],['Números',/\d/.test(v)],['Símbolos',/[^A-Za-z0-9]/.test(v)],['Sem padrões comuns',v&&!common]];
  chk.textContent='';rules.forEach(function(r){chk.appendChild(el('li',r[0],r[1]?'on':''));});
});
// Tempo de quebra (estimativa: 10 bilhões de tentativas por segundo, ataque offline)
var pwtime=document.getElementById('pwtime');
function ht(s){var y=s/31557600;if(s<1)return'menos de 1 segundo';if(s<60)return Math.round(s)+' segundos';if(s<3600)return Math.round(s/60)+' minutos';if(s<86400)return Math.round(s/3600)+' horas';if(y<1)return Math.round(s/86400)+' dias';if(y<1e6)return Math.round(y).toLocaleString('pt-BR')+' anos';if(y<1e9)return'milhões de anos';return'bilhões de anos';}

// Tema
var tb=document.getElementById('th');
tb.onclick=function(){var l=document.documentElement.dataset.theme==='light';document.documentElement.dataset.theme=l?'dark':'light';tb.textContent=l?'☀️':'🌙';};

// Desafio relâmpago
(function(){
 var box=document.getElementById('duel'),n=0,t,pool=[
  {m:'SMS: "Você ganhou R$ 500 no Pix! Resgate em 10 minutos: bit.ly/premio-pix"',s:1,w:'Prêmio com prazo curto e link encurtado é isca clássica.'},
  {m:'Prefeitura: "Sua guia de IPTU 2026 está disponível. Acesse o portal oficial digitando o endereço no navegador."',s:0,w:'Não traz link nem urgência e orienta a abrir o site por conta própria.'},
  {m:'WhatsApp: "Oi, aqui é o suporte. Entre na chamada de vídeo e compartilhe a tela para resolvermos sua conta."',s:1,w:'Suporte de verdade não pede para você compartilhar a tela.'}
 ];
 function go(){
  clearInterval(t);box.textContent='';
  var d=pool[n++%pool.length],left=100,done=false;
  box.appendChild(el('h3','Desafio relâmpago: golpe ou legítima? Você tem 10 segundos.'));
  box.appendChild(el('div',d.m,'msg'));
  var bar=el('div','','bar'),fill=el('i');fill.style.width='100%';fill.style.background='var(--ac)';bar.appendChild(fill);box.appendChild(bar);
  var o=el('div','','opts');
  function end(k){
   if(done)return;done=true;clearInterval(t);
   o.querySelectorAll('button').forEach(function(b){b.disabled=true;});
   var ok=k===d.s;
   box.appendChild(el('div',(k<0?'Tempo esgotado. Golpistas contam com a pressa. ':ok?'Correto. ':'Errou. ')+d.w,'fb '+(ok?'ok':'no')));
   var nx=el('button','Outra mensagem','btn');nx.style.marginTop='12px';nx.onclick=go;box.appendChild(nx);
  }
  ['Golpe','Legítima'].forEach(function(l,k){var b=el('button',l,'btn alt');b.onclick=function(){end(k===0?1:0);};o.appendChild(b);});
  box.appendChild(o);
  t=setInterval(function(){left--;fill.style.width=left+'%';if(left<=0)end(-1);},100);
 }
 go();
})();

// Caixa de e-mail: o link mostra um destino, mas leva a outro
(function(){
 var box=document.getElementById('phish'),i=0,sc=0,mails=[
  {f:'suporte@banco-seguro-atendimento.com',s:'Conta bloqueada!',b:'Sua conta será encerrada em 2 horas. Para evitar, ',l:'acesse o portal do banco',u:'http://banco-seguro-atendimento.com/login',x:1,w:'Urgência, ameaça e um domínio que não é do banco.'},
  {f:'nfe@mercadoenvios.example',s:'Seu pedido saiu para entrega',b:'O pedido #48213 chega amanhã. Você também pode acompanhar ',l:'no site oficial',u:'https://www.mercadoenvios.example/rastreio',x:0,w:'O link coincide com o domínio do remetente e não há pressão nem pedido de dados.'},
  {f:'rh@suaempresa-benef1tos.example',s:'Bônus de fim de ano',b:'Baixe o arquivo e habilite as macros para ver seu valor: ',l:'bonus.xlsm',u:'https://suaempresa-benef1tos.example/dl/bonus.xlsm',x:1,w:'O domínio troca "i" por "1" e pede macros em um anexo inesperado.'},
  {f:'contato@receita-restituicao.example',s:'Restituição disponível',b:'Consulte sua restituição em ',l:'receita.fazenda.gov.br',u:'http://restituicao-gov.example/cpf',x:1,w:'O texto do link mostra um site do governo, mas o destino real é outro. Confira sempre antes de clicar.'}
 ];
 function show(){
  box.textContent='';
  if(i>=mails.length){
   prog('phish',sc,mails.length);box.appendChild(el('h3','Resultado: '+sc+' de '+mails.length));
   var r=el('button','Refazer','btn');r.onclick=function(){i=0;sc=0;show();};box.appendChild(r);return;
  }
  var m=mails[i];
  box.appendChild(el('h3','Caixa de entrada: e-mail '+(i+1)+' de '+mails.length));
  box.appendChild(el('p','Passe o mouse sobre o link (ou toque nele) para ver o destino real.','meta'));
  var card=el('div','','msg mail'),h=el('div','De: '+m.f+'  |  Assunto: '+m.s,'mailh'),p=el('p',m.b),a=el('a',m.l),st=el('div','','stat');
  a.href='#';a.setAttribute('role','link');
  function reveal(e){if(e)e.preventDefault();st.textContent='Destino real: '+m.u;}
  a.onmouseenter=reveal;a.onfocus=reveal;a.onclick=reveal;
  p.style.margin='0';p.appendChild(a);card.appendChild(h);card.appendChild(p);card.appendChild(st);box.appendChild(card);
  var o=el('div','','opts');
  ['Golpe','Legítimo'].forEach(function(l,k){var b=el('button',l,'btn alt');b.onclick=function(){
   var ok=(k===0?1:0)===m.x;if(ok)sc++;
   o.querySelectorAll('button').forEach(function(x){x.disabled=true;});reveal();
   box.appendChild(el('div',(ok?'Correto. ':'Não foi dessa vez. ')+m.w,'fb '+(ok?'ok':'no')));
   var nx=el('button',i+1<mails.length?'Próximo e-mail':'Ver resultado','btn');nx.style.marginTop='12px';nx.onclick=function(){i++;show();};box.appendChild(nx);nx.focus();
  };o.appendChild(b);});
  box.appendChild(o);
 }
 show();
})();

// Incidente com ramificações e prejuízo acumulado
(function(){
 var box=document.getElementById('incid'),cost=0,N={
  m:{t:'Escolha um cenário fictício para treinar.',c:[['Ransomware na Alfa Contábil','s',0],['Planilha enviada ao destinatário errado','p',0],['Celular corporativo roubado','q',0]]},
  p:{t:'Um colega enviou por engano uma planilha com dados de clientes a um e-mail externo.',c:[['Apagar os arquivos e não contar a ninguém','pbad',100],['Avisar o responsável de segurança imediatamente','p2',10]]},
  p2:{t:'O responsável pede para preservar a mensagem enviada e identificar quais dados foram expostos.',c:[['Registrar o que foi enviado, tentar recolher a mensagem e pedir ao destinatário que apague','p3',10],['Esperar para ver se alguém reclama','pbad',120]]},
  p3:{t:'A planilha tinha CPF e e-mail de 300 clientes. Quem avalia se é preciso comunicar a ANPD e os titulares?',c:[['O próprio colega que errou','pbad',60],['O encarregado (DPO) com o responsável de segurança, avaliando o risco aos titulares','pok',15]]},
  pok:{e:'ok',t:'O envio foi registrado, o risco avaliado por quem deve decidir e a comunicação seguiu o procedimento.'},
  pbad:{e:'bad',t:'Sem registro nem avaliação, o incidente ficou escondido. Se os dados forem usados em golpes, a empresa responde por não ter agido.'},
  q:{t:'O celular corporativo de um vendedor foi roubado, com e-mail e contatos de clientes.',c:[['Esperar alguns dias, ele pode aparecer','qbad',150],['Avisar a empresa e bloquear ou apagar o aparelho remotamente','q2',20]]},
  q2:{t:'O aparelho foi bloqueado. Ele não tinha criptografia e havia e-mails com dados de clientes.',c:[['Trocar as senhas, encerrar sessões, registrar o fato e avaliar o risco com o encarregado','qok',20],['Dar por resolvido, o aparelho foi bloqueado','qbad',90]]},
  qok:{e:'ok',t:'Acessos revogados, fato registrado e risco avaliado. A criptografia de disco teria reduzido ainda mais o impacto.'},
  qbad:{e:'bad',t:'O atraso deixou e-mails e contatos expostos por dias, sem registro nem avaliação de risco.'},
  s:{t:'Segunda, 9h. Na Alfa Contábil (empresa fictícia), arquivos aparecem renomeados e surge um pedido de resgate em criptomoeda.',c:[['Pagar o resgate rapidamente','pay',300],['Desconectar as máquinas da rede e acionar o plano de resposta','iso',20]]},
  pay:{t:'Você pagou, mas a chave enviada falha em metade dos arquivos e os criminosos agora sabem que a empresa paga.',c:[['Tentar restaurar do backup','bk',60],['Esperar uma nova chave','bad2',200]]},
  iso:{t:'O avanço parou e há um backup de sexta-feira. Dados de clientes podem ter sido copiados antes da criptografia.',c:[['Restaurar o backup e não comentar o episódio','hide',50],['Restaurar, preservar evidências e avaliar o risco com o encarregado (DPO)','ok',30]]},
  bk:{t:'O backup restaura os arquivos, mas o ataque pode ter vazado dados e ninguém avaliou o risco aos titulares.',c:[['Avaliar o incidente e comunicar se houver risco relevante','ok',40],['Seguir em frente sem registrar','hide',80]]},
  hide:{e:'bad',t:'Meses depois, os dados vazados aparecem à venda. Sem registro nem comunicação, a empresa descumpriu a LGPD e perdeu a confiança dos clientes.'},
  bad2:{e:'bad',t:'Sem chave e sem plano, a operação ficou parada por semanas.'},
  ok:{e:'ok',t:'Incidente contido, dados restaurados, risco avaliado e comunicação feita conforme o plano. A empresa preservou a confiança dos clientes.'}
 };
 function go(k){
  var n=N[k];box.textContent='';
  box.appendChild(el('h3','Simulador de incidentes'));
  box.appendChild(el('div',n.t,'msg'));
  box.appendChild(el('p','Prejuízo estimado até agora: R$ '+cost+' mil (valores fictícios)','meta'));
  var o=el('div','','opts');
  if(n.e){prog('inc',n.e==='ok'?1:0,1);
   box.appendChild(el('div',n.e==='ok'?'Final bom.':'Final ruim.','fb '+(n.e==='ok'?'ok':'no')));
   var r=el('button','Jogar de novo','btn');r.onclick=function(){cost=0;go('m');};o.appendChild(r);
  }else n.c.forEach(function(c){var b=el('button',c[0],'btn alt');b.onclick=function(){cost+=c[2];go(c[1]);};o.appendChild(b);});
  box.appendChild(o);
 }
 go('m');
})();
// Progresso local, medalhas e trilhas
var P={},KEYS=['quiz','phish','class','inc','diag','chk','thr'];try{var raw=JSON.parse(localStorage.getItem('sd')||'{}');if(raw&&typeof raw==='object')KEYS.forEach(function(k){if(typeof raw[k]==='number'&&raw[k]>=0&&raw[k]<=100)P[k]=raw[k];});}catch(e){}
function save(){try{localStorage.setItem('sd',JSON.stringify(P));}catch(e){}panel();}
function prog(k,s,t){var p=Math.round(100*s/t);if(!(P[k]>=p))P[k]=p;save();}
var TR=[['Proteção contra golpes',[['Explorar a central de ameaças','thr','#ameacas'],['Analisar e-mails suspeitos','phish','#lab'],['Responder o desafio','quiz','#quiz']]],['Privacidade e LGPD',[['Classificar dados','class','#lab'],['Decidir em um incidente','inc','#lab'],['Responder o desafio','quiz','#quiz']]],['Segurança no dia a dia',[['Fazer o diagnóstico','diag','#diag'],['Revisar o checklist da empresa','chk','#empresas'],['Explorar a central de ameaças','thr','#ameacas']]]];
function panel(){
 var box=document.getElementById('pan'),tk=document.getElementById('trk');if(!box)return;
 box.textContent='';tk.textContent='';
 var g=el('div','','grid');
 [['Conhecimento','quiz'],['Prevenção','phish'],['Privacidade','class'],['Incidentes','inc'],['Diagnóstico','diag'],['Empresa','chk']].forEach(function(x){
  var c=el('div','','card'),v=P[x[1]]||0,b=el('div','','bar'),f=el('i');
  f.style.width=v+'%';f.style.background='var(--ac)';b.appendChild(f);
  c.appendChild(el('h3',x[0]));c.appendChild(el('div',v+'%','big'));c.appendChild(b);g.appendChild(c);
 });
 box.appendChild(g);
 box.appendChild(el('h3','Medalhas'));
 var u=el('ul','','chk');
 [['Primeiro passo: concluiu uma atividade',Object.keys(P).some(function(k){return P[k]>0;})],['Olho atento: acertou todos os e-mails de phishing',P.phish===100],['Guardião dos dados: 80% ou mais no classificador',P['class']>=80],['Preparado: fez o diagnóstico',P.diag>0],['Sangue frio: chegou a um final bom no simulador de incidentes',P.inc===100]].forEach(function(m){u.appendChild(el('li',m[0],m[1]?'on':''));});
 box.appendChild(u);
 TR.forEach(function(t){
  var c=el('div','','card'),n=t[1].filter(function(s){return P[s[1]]>0;}).length,l=el('ul','','chk');
  c.appendChild(el('h3',t[0]));c.appendChild(el('p',n+' de '+t[1].length+' passos concluídos','meta'));
  t[1].forEach(function(s){var li=el('li','',P[s[1]]>0?'on':''),a=el('a',s[0]);a.href=s[2];li.appendChild(a);l.appendChild(li);});
  c.appendChild(l);tk.appendChild(c);
 });
}
document.getElementById('rst').onclick=function(){P={};try{localStorage.removeItem('sd');localStorage.removeItem('sdc');}catch(e){}location.reload();};

// Diagnóstico
(function(){
 var Q=[['Uso autenticação em dois fatores nas contas principais','Ative a verificação em duas etapas no e-mail, no banco e nas redes sociais.'],['Uso uma senha diferente em cada serviço','Use um gerenciador de senhas para ter uma senha única por serviço.'],['Mantenho celular e computador atualizados','Ative as atualizações automáticas.'],['Faço backup dos arquivos importantes','Faça backup periódico em local separado e teste a restauração.'],['Desconfio de mensagens com urgência ou links inesperados','Confira o remetente e o destino real do link antes de clicar.'],['Bloqueio a tela do celular com senha ou biometria','Ative o bloqueio de tela com tempo curto.'],['Evito Wi-Fi público para acessar banco e e-mail','Em redes públicas, prefira dados móveis.'],['Compartilho documentos de trabalho só por canais autorizados','Use apenas os canais aprovados pela empresa.'],['Reviso permissões de aplicativos e o que publico de dados pessoais','Revise permissões e limite os dados pessoais publicados.'],['Sei a quem recorrer se sofrer um golpe ou incidente','Defina antes a quem avisar: banco, empresa e registro de ocorrência.']],
 box=document.getElementById('dgb'),i=0,a=[];
 function show(){
  box.textContent='';
  if(i>=Q.length){
   var sc=a.reduce(function(x,y){return x+y;},0);prog('diag',sc,100);
   box.appendChild(el('h3',sc+'/100: '+(sc>=80?'Boa conscientização':sc>=50?'Conscientização em desenvolvimento':'Vale reforçar o básico')));
   var w=Q.filter(function(q,k){return a[k]<10;});
   if(w.length){box.appendChild(el('p','Pontos que precisam de atenção:','meta'));var u=el('ul','','chk');w.forEach(function(q){u.appendChild(el('li',q[1]));});box.appendChild(u);}
   var r=el('button','Refazer','btn');r.onclick=function(){i=0;a=[];show();};box.appendChild(r);return;
  }
  box.appendChild(el('h3','Pergunta '+(i+1)+' de '+Q.length));
  box.appendChild(el('p',Q[i][0]+'?'));
  var o=el('div','','opts');
  [['Sim',10],['Às vezes',5],['Não',0]].forEach(function(x){var b=el('button',x[0],'btn alt');b.onclick=function(){a[i]=x[1];i++;show();};o.appendChild(b);});
  box.appendChild(o);
 }
 show();
})();

// Central de ameaças
(function(){
 var TH=[
 ['Phishing','Golpes digitais','Mensagem falsa que imita uma marca ou pessoa para roubar dados ou induzir um clique. Risco: acesso indevido a contas e prejuízo financeiro.','Urgência, ameaça, remetente estranho e link cujo destino real é outro.','Confira o remetente e o destino do link; prefira digitar o endereço do site.','Troque as senhas, ative a verificação em duas etapas e avise o banco ou a empresa.'],
 ['Falso suporte','Golpes digitais','Golpista finge ser a central de uma loja ou banco e pede chamada de vídeo, código ou Pix. Risco: perda de dinheiro e controle do aparelho.','Contato que você não pediu, pedido de código, de compartilhamento de tela ou de pagamento.','Nunca compartilhe tela nem códigos; ligue você mesmo para o canal oficial.','Encerre o contato, avise o banco, troque as senhas e registre a ocorrência.'],
 ['Ransomware','Ataques a sistemas','Software que criptografa arquivos e cobra resgate. Risco: parada da operação e vazamento de dados.','Arquivos com extensão estranha, bilhete de resgate e lentidão repentina.','Backups separados e testados, sistemas atualizados e atenção a anexos.','Desconecte o aparelho da rede, acione o responsável de segurança e avalie com especialistas antes de qualquer pagamento.'],
 ['Roubo de identidade','Roubo de identidade','Uso de dados pessoais de alguém para abrir contas, pedir crédito ou aplicar golpes em seu nome.','Cobranças ou contas que você não reconhece e avisos de cadastro que você não fez.','Compartilhe o mínimo de dados, use verificação em duas etapas e guarde documentos com cuidado.','Registre ocorrência, avise as empresas envolvidas e acompanhe seus dados de crédito.'],
 ['Vazamento de dados','Vazamento de informações','Exposição de dados por ataque, falha ou erro humano. Risco: fraudes contra os titulares e sanções à empresa.','Avisos de empresas, golpes que citam seus dados corretos e acessos que você não fez.','Senhas únicas, coleta mínima de dados e controle de acesso.','Troque senhas, ative a verificação em duas etapas e, em empresas, registre o incidente e avalie com o encarregado (DPO).'],
 ['Compartilhamento indevido','Ameaças corporativas','Arquivos com dados enviados à pessoa errada ou por canal não autorizado.','Planilhas em e-mail pessoal, links públicos e destinatários externos por engano.','Use canais aprovados, acesso por perfil e confirme o destinatário antes de enviar.','Avise o responsável de segurança, tente recolher o envio e registre o que foi exposto.']
 ],cats=['Todas'],f=document.getElementById('thf'),l=document.getElementById('thl'),cur='Todas';
 TH.forEach(function(t){if(cats.indexOf(t[1])<0)cats.push(t[1]);});
 function draw(){
  f.textContent='';l.textContent='';
  cats.forEach(function(c){var b=el('button',c,'btn'+(c===cur?'':' alt'));b.style.flex='0 0 auto';b.onclick=function(){cur=c;draw();};f.appendChild(b);});
  TH.filter(function(t){return cur==='Todas'||t[1]===cur;}).forEach(function(t){
   var d=document.createElement('details');d.appendChild(el('summary',t[0]+' ('+t[1]+')'));if(t[0]==='Falso suporte'){var fg=el('figure','','fig'),im=document.createElement('img');im.src='img/ligacao-suspeita-home-office.webp';im.alt='Mulher ao telefone anotando algo, com um notebook aberto na mesa';im.width=678;im.height=452;im.loading='lazy';fg.appendChild(im);fg.appendChild(el('figcaption','Ligação inesperada pedindo dados? Desligue e ligue você mesmo para o canal oficial.'));d.appendChild(fg);}
   [['O que é e riscos',2],['Como identificar',3],['Como se proteger',4],['O que fazer se acontecer',5]].forEach(function(x){var p=el('p');p.appendChild(el('b',x[0]+': '));p.appendChild(document.createTextNode(t[x[1]]));d.appendChild(p);});
   d.ontoggle=function(){if(d.open)prog('thr',1,1);};l.appendChild(d);
  });
 }
 draw();
})();

// Checklist para pequenas empresas
(function(){
 var L=['Senhas únicas, com gerenciador de senhas','Verificação em duas etapas no e-mail e nos sistemas','Backup periódico, com teste de restauração','Computadores e sistemas atualizados','Cada pessoa com seu acesso, revogado quando sai da empresa','Dados de clientes acessíveis só a quem precisa','Notebooks e celulares com bloqueio de tela e criptografia','Equipe orientada sobre golpes e phishing','Plano para incidentes: quem avisar e como registrar','Descarte seguro de documentos e equipamentos'],
 box=document.getElementById('chk'),S=[],cnt=el('p','','meta');
 try{S=JSON.parse(localStorage.getItem('sdc')||'[]');}catch(e){}if(!Array.isArray(S))S=[];
 box.appendChild(cnt);
 function upd(){var n=S.filter(Boolean).length;cnt.textContent=n+' de '+L.length+' práticas em dia';P.chk=Math.round(100*n/L.length);save();}
 L.forEach(function(t,k){
  var lb=el('label'),cb=document.createElement('input');cb.type='checkbox';cb.checked=!!S[k];
  cb.onchange=function(){S[k]=cb.checked;try{localStorage.setItem('sdc',JSON.stringify(S));}catch(e){}upd();};
  lb.appendChild(cb);lb.appendChild(document.createTextNode(' '+t));lb.style.cssText='display:block;padding:5px 0';box.appendChild(lb);
 });
 upd();
})();
// Tema com preferência salva, menu móvel e seção atual
var root=document.documentElement,th='light';
try{th=localStorage.getItem('sdt')==='dark'?'dark':'light';}catch(e){}
function setTh(t){root.dataset.theme=t;tb.textContent=t==='dark'?'Tema claro':'Tema escuro';try{localStorage.setItem('sdt',t);}catch(e){}}
tb.onclick=function(){setTh(root.dataset.theme==='dark'?'light':'dark');};setTh(th);
var mt=document.getElementById('mt'),nl=document.getElementById('nl');
mt.onclick=function(){var o=nl.classList.toggle('open');mt.setAttribute('aria-expanded',o);};
nl.addEventListener('click',function(e){if(e.target.tagName==='A'){nl.classList.remove('open');mt.setAttribute('aria-expanded','false');}});
var G={conceitos:'#conceitos',ameacas:'#conceitos',trilhas:'#conceitos',lab:'#lab',diag:'#lab',quiz:'#lab',painel:'#painel',empresas:'#empresas',biblioteca:'#biblioteca'};
if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting)nl.querySelectorAll('a').forEach(function(a){if(a.getAttribute('href')===G[en.target.id])a.setAttribute('aria-current','true');else a.removeAttribute('aria-current');});});},{rootMargin:'-40% 0px -55% 0px'});Object.keys(G).forEach(function(id){var s=document.getElementById(id);if(s)io.observe(s);});}
document.querySelectorAll('.tabs button').forEach(function(b){b.textContent=b.textContent.replace(/^\S+\s/,'');});
