# CerealsHub Server

CerealsHub的后端服务，基于Spring Boot构建，提供用户管理、消息通信和群组功能。

## 功能特性

- 用户认证和授权（JWT）
- 实时消息通信（WebSocket）
- 联系人管理
- 群组聊天
- 用户状态管理
- Docker容器化部署

## 技术栈

- Spring Boot 3.x
- Spring Security
- Spring Data JPA
- PostgreSQL
- WebSocket
- JWT
- Maven

## 快速开始

### 环境要求

- Java 17+
- Maven 3.6+
- Docker (可选，用于容器化部署)
- PostgreSQL (可选，使用Docker时会自动创建)

### 本地运行

1. 克隆项目
2. 配置数据库连接（application.properties）
3. 运行项目：
   ```bash
   mvn spring-boot:run
   ```

### Docker部署

```bash
docker-compose up -d
```

## API文档

启动服务后，访问 `http://localhost:8080/swagger-ui.html` 查看API文档。

## 管理界面

访问 `http://localhost:8080/admin` 进入管理界面。

## 配置

```
# Server configuration
server.port=8080

# Database configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/cereals_hub
spring.datasource.username=cereals_user
spring.datasource.password=cereals_pass

# JWT configuration
jwt.secret=your_secret_key_here
jwt.expiration=86400000
```

## 开发

### 项目结构

```
src/
├── main/
│   ├── java/
│   │   └── com/cereals/hub/
│   │       ├── config/       # Configuration classes
│   │       ├── controller/   # REST controllers
│   │       ├── model/        # Entity classes
│   │       ├── repository/   # Data access interfaces
│   │       ├── service/      # Business logic
│   │       ├── websocket/    # WebSocket components
│   │       └── ServerApplication.java
│   └── resources/
│       ├── templates/        # Thymeleaf templates
│       └── application.properties
└── test/                     # Unit and integration tests
```

## 贡献

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License

This project is licensed under the MIT License.