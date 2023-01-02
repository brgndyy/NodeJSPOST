const Sequelize = require("sequelize");

module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        user_id: {
          type: Sequelize.STRING(20),
          allowNull: false,
          unique: true,
        },
        user_password: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
      },
      {
        // static init 메서드의 매개변수와 연결되는 옵션
        //db.sequelize 객체를 넣어야함. model/index.js 에서 연결
        sequelize,

        // true라면 각 로우가 수정, 생성될때 시간이 자동으로 입력됨
        timestamps: false,

        //기본값인 캐멀 케이스(createdAt)을 스네이크 케이스(created_at)으로 바꿔줌
        underscored: false,

        // 모델 이름을 설정
        modelName: "User",

        //실제 데이터 베이스의 테이블 이름이됨, 기본적으로 모델이름을 소문자 및 복수형으로 만듬
        tableName: "users",

        // true 로 설정하면 deletedAt이라는 컬럼이 생김, 로우를 삭제할때 지운시각이 기록됨
        // 나중에 로우를 복원해야할수도 있을때 true로 설정
        paranoid: false,

        //한글로 입력을 받기 위해서 설정해야함
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }

  static associate(db) {
    db.User.hasMany(db.Post, { foreignKey: "post_writer", sourceKey: "id" });
  }
};
