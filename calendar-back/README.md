2017/05/02
node app -https

2017/02/10
SecurityHook으로 생성되는 모든 Client모델들의 isPreview Property가 true로 설정되어 클라이언트에서 프리뷰기능 지원안한다고 막힐때 db isPreview false 설정
db.getCollection('clients').updateMany({},{$set:{isPreview:false}})

