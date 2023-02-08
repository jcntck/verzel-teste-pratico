CREATE DATABASE verzel;

\c verzel;
-- --------------------------------------------------------
-- Servidor:                     127.0.0.1
-- Versão do servidor:           PostgreSQL 15.0 (Debian 15.0-1.pgdg110+1) on x86_64-pc-linux-gnu, compiled by gcc (Debian 10.2.1-6) 10.2.1 20210110, 64-bit
-- OS do Servidor:               
-- HeidiSQL Versão:              12.1.0.6537
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES  */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Copiando estrutura para tabela public.brands
DROP TABLE IF EXISTS "brands";
CREATE TABLE IF NOT EXISTS "brands" (
	"id" SERIAL PRIMARY KEY,
	"name" VARCHAR(200) NOT NULL,
	"iconPath" VARCHAR NULL DEFAULT NULL,
	UNIQUE ("name")
);

-- Copiando dados para a tabela public.brands: 5 rows
/*!40000 ALTER TABLE "brands" DISABLE KEYS */;
INSERT INTO "brands" ("id", "name", "iconPath") VALUES
	(34, 'Jeep', 'https://ucarecdn.com/95b41d82-bfdb-4078-949d-cdcffd0173c8/'),
	(33, 'Renault', 'https://ucarecdn.com/e134f300-43a3-458d-9a20-33de6b72cfdd/'),
	(40, 'Chevrolet', ''),
	(41, 'Volkswagen', 'https://ucarecdn.com/52940f10-0545-4b7f-ba64-5ca93be0d72a/'),
	(32, 'Fiat', 'https://ucarecdn.com/82025bd3-b5fe-4df7-be75-f03efe94ff7b/');
/*!40000 ALTER TABLE "brands" ENABLE KEYS */;

-- Copiando estrutura para tabela public.models
DROP TABLE IF EXISTS "models";
CREATE TABLE IF NOT EXISTS "models" (
	"id" SERIAL PRIMARY KEY,
	"name" VARCHAR(200) NOT NULL,
	"brandId" INTEGER NULL DEFAULT NULL,
	CONSTRAINT "FK_1f36b4eb435f410c6749378cf8c" FOREIGN KEY ("brandId") REFERENCES "brands" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION
);

-- Copiando dados para a tabela public.models: 15 rows
/*!40000 ALTER TABLE "models" DISABLE KEYS */;
INSERT INTO "models" ("id", "name", "brandId") VALUES
	(16, 'Siena', 32),
	(17, 'Argo', 32),
	(18, 'Argo Fit', 32),
	(20, 'Argo Fit', 33),
	(21, 'Renegade', 34),
	(25, 'Kwid', 33),
	(26, 'Pulse', 32),
	(27, 'Logan', 33),
	(28, 'Cronos', 32),
	(29, 'Taos', 41),
	(30, 'Commander', 34),
	(31, 'Cobalt', 40),
	(32, 'Sandero', 33),
	(33, 'Virtus', 41),
	(34, 'Tracker', 40),
	(35, 'Onix', 40),
	(36, 'T-Cross', 41);
/*!40000 ALTER TABLE "models" ENABLE KEYS */;

-- Copiando estrutura para tabela public.users
DROP TABLE IF EXISTS "users";
CREATE TABLE IF NOT EXISTS "users" (
	"id" SERIAL PRIMARY KEY,
	"name" VARCHAR(200) NOT NULL,
	"email" VARCHAR(200) NOT NULL,
	"password" VARCHAR NOT NULL,
	"createdAt" TIMESTAMP NOT NULL DEFAULT 'now()',
	"updatedAt" TIMESTAMP NOT NULL DEFAULT 'now()',
	UNIQUE ("email")
);

-- Copiando dados para a tabela public.users: 1 rows
/*!40000 ALTER TABLE "users" DISABLE KEYS */;
INSERT INTO "users" ("id", "name", "email", "password", "createdAt", "updatedAt") VALUES
	(1, 'John Foe', 'john-foe@email.com', 'password_hash', '2023-02-03 14:36:43.318522', '2023-02-03 14:36:43.318522'),
	(69, 'John Foe II', 'john-foe-teste@email.com', '$2b$10$EIVrAkCYtExJxi3O7vArW.A/ApY0bUvs7IcJJdRP4gQ1Ko4HkVkIG', '2023-02-03 21:37:07.917749', '2023-02-06 23:47:01.203621'),
	(71, 'Cassio Albergue I', 'cassio_albergue@email.com', '$2b$10$NrazPjLpd4EXFoIdXdfzxe3qouvHsolq6tf6nftahutRRUHzbJGmi', '2023-02-06 23:45:11.886664', '2023-02-07 20:44:55.605258'),
	(74, 'João Neto', 'joao@teste.com', '$2b$10$v9L6hJ4Cv0WmEzD8z5YJg.SfG0VsFrOIledkH.oQ1wlzSCv0ENVKm', '2023-02-07 20:45:06.014667', '2023-02-07 20:45:06.014667');
/*!40000 ALTER TABLE "users" ENABLE KEYS */;

-- Copiando estrutura para tabela public.vehicles
DROP TABLE IF EXISTS "vehicles";
CREATE TABLE IF NOT EXISTS "vehicles" (
	"id" SERIAL PRIMARY KEY,
	"name" VARCHAR NOT NULL,
	"photoPath" VARCHAR NULL DEFAULT NULL,
	"modelId" INTEGER NULL DEFAULT NULL,
	"price" INTEGER NOT NULL,
	CONSTRAINT "FK_5fe3e38b9bf4649e65fdfb04bdf" FOREIGN KEY ("modelId") REFERENCES "models" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION
);

-- Copiando dados para a tabela public.vehicles: -1 rows
/*!40000 ALTER TABLE "vehicles" DISABLE KEYS */;
INSERT INTO "vehicles" ("id", "name", "photoPath", "modelId", "price") VALUES
	(5, '2.0 16V TURBO DIESEL MOAB 4P 4X4 AUTOMÁTICO', 'https://ucarecdn.com/372c3500-96e2-460f-9662-2e4716e8b1e1/', 21, 150000),
	(8, 'INTENSE', 'https://ucarecdn.com/fa7aed99-ce52-4a0f-8598-920690a49523/', 25, 66299),
	(4, '1.0 Mpi Fire 8v Flex 4p Manual', 'https://ucarecdn.com/f13f2259-9ed8-42c5-b22c-0c1f12ba8914/', 16, 38000),
	(9, 'ZEN', 'https://ucarecdn.com/40a6b7eb-8b89-4b21-8a76-3b9d7c2769ee/', 25, 62499),
	(10, 'IMPETUS', 'https://ucarecdn.com/09473b18-b318-42d9-b4b7-9cc4bc2032d6/', 26, 122499),
	(11, 'SCE ICONIC X-TRONIC', 'https://ucarecdn.com/01def66d-46e3-49d1-a192-593e3ffa964c/', 27, 72199),
	(12, 'E.TORQ PRECISION', 'https://ucarecdn.com/0d78b68b-84bf-4aed-94aa-1573cc030a59/', 28, 74899),
	(13, '200 TSI HIGHLINE', 'https://ucarecdn.com/f088ffd3-6d22-475d-a100-eb112fb0dfa6/', 29, 190699),
	(14, 'LIMITED AT6', 'https://ucarecdn.com/d02ec285-a5ee-407e-b4fe-db59397238aa/', 30, 224599),
	(15, 'MPFI LTZ', 'https://ucarecdn.com/ec6432d8-aa07-4a60-ba24-31eecddade0c/', 31, 68799),
	(16, 'STEPWAY', 'https://ucarecdn.com/6646e8cb-9657-4e44-919d-c0339933472b/', 32, 68299),
	(17, 'MSI TOTAL', 'https://ucarecdn.com/89ad4bc6-fbb7-4e64-9a19-f04f0b6410c9/', 33, 72499),
	(18, '1.2 PREMIER AUTOMÁTICO', 'https://ucarecdn.com/833b704e-4fc1-4f0d-bdba-77eb307dd6ee/', 34, 140699),
	(19, 'MPFI LT', 'https://ucarecdn.com/b0d3bc34-80fd-4b72-a973-ef39c5aeca2c/', 35, 58899),
	(20, '200 TSI TOTAL AUTOMÁTICO', 'https://ucarecdn.com/1918c0c0-c6c0-49a5-810b-538ad84538c4/', 36, 109399);
/*!40000 ALTER TABLE "vehicles" ENABLE KEYS */;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
