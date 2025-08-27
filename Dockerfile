# 多阶段构建：第一阶段使用Maven构建应用
FROM maven:3.9.4-eclipse-temurin-17 AS build

# 设置工作目录
WORKDIR /app

# 复制pom.xml和源代码
COPY pom.xml .
COPY src ./src

# 构建应用
RUN mvn clean package -DskipTests

# 第二阶段：使用OpenJDK运行时
FROM openjdk:17-jdk-slim

# 设置维护者信息
LABEL maintainer="CerealsHub Team"

# 设置工作目录
WORKDIR /app

# 从构建阶段复制JAR文件
COPY --from=build /app/target/*.jar app.jar

# 暴露端口
EXPOSE 8080

# 运行应用程序
ENTRYPOINT ["java", "-jar", "app.jar"]