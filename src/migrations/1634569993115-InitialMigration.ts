import {MigrationInterface, QueryRunner} from "typeorm";

export class InitialMigration1634569993115 implements MigrationInterface {
    name = 'InitialMigration1634569993115'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "username_premiumtype_enum" AS ENUM('None', 'Premium', 'Trademark')`);
        await queryRunner.query(`CREATE TABLE "username" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying, "premiumType" "username_premiumtype_enum" NOT NULL DEFAULT 'None', "expireDate" date, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "ownerId" uuid, "biolinkId" uuid, CONSTRAINT "UQ_b39ad32e514b17e90c93988888a" UNIQUE ("username"), CONSTRAINT "REL_cf5379446c7770ce52819823aa" UNIQUE ("biolinkId"), CONSTRAINT "PK_fd8e31cc54a22af809d3fbf587b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "biolink_verificationstatus_enum" AS ENUM('Not Applied', 'Pending', 'Verified', 'Rejected')`);
        await queryRunner.query(`CREATE TABLE "biolink" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "profilePhotoUrl" character varying DEFAULT 'http://localhost:4000/static/defaultProfilePhoto.png', "coverPhotoUrl" character varying DEFAULT 'http://localhost:4000/static/defaultCoverPhoto.jpg', "displayName" character varying, "city" character varying, "state" character varying, "country" character varying, "latitude" double precision, "longitude" double precision, "bio" character varying, "settings" json, "verificationStatus" "biolink_verificationstatus_enum" DEFAULT 'Not Applied', "verifiedGovernmentId" boolean DEFAULT false, "verifiedEmail" boolean DEFAULT false, "verifiedPhoneNumber" boolean DEFAULT false, "verifiedWorkEmail" boolean DEFAULT false, "featured" boolean DEFAULT false, "changedUsername" boolean DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "usernameId" uuid, "userId" uuid, "categoryId" integer, "verificationId" uuid, CONSTRAINT "UQ_286f699402052a53ca1b589caae" UNIQUE ("usernameId", "deletedAt"), CONSTRAINT "REL_8c08ae439ea48b8fa5efd17c36" UNIQUE ("usernameId"), CONSTRAINT "REL_d4c935e9f1437f2398b9432464" UNIQUE ("verificationId"), CONSTRAINT "PK_e8c9c2d68eb099d0f9982a2f3bc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "black_list_blacklisttype_enum" AS ENUM('Email', 'Username', 'BadWord')`);
        await queryRunner.query(`CREATE TABLE "black_list" ("id" SERIAL NOT NULL, "blacklistType" "black_list_blacklisttype_enum" NOT NULL DEFAULT 'BadWord', "keyword" character varying, "reason" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "UQ_6d45b0e085cdea0bdfaf7d1ba41" UNIQUE ("blacklistType", "keyword"), CONSTRAINT "PK_6969ca1c62bdf4fef47a85b8195" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "category" ("id" SERIAL NOT NULL, "categoryName" character varying, "featured" boolean DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "UQ_cb776c7d842f8375b60273320dc" UNIQUE ("categoryName"), CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "chat_room_to_user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "totalUnreadMessages" integer NOT NULL DEFAULT '0', "userId" uuid, "chatRoomId" uuid, CONSTRAINT "PK_6f27e86fa885f79a58dbcbacb50" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "chat_room" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "roomName" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "lastMessageSentDate" TIMESTAMP, "lastMessageSentId" uuid, CONSTRAINT "REL_f4e2d3c75df8e871e3ccb63d9e" UNIQUE ("lastMessageSentId"), CONSTRAINT "PK_8aa3a52cf74c96469f0ef9fbe3e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "code_type_enum" AS ENUM('Discount', 'Referral')`);
        await queryRunner.query(`CREATE TABLE "code" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "code_type_enum" NOT NULL DEFAULT 'Discount', "code" character varying, "discount" integer DEFAULT '0', "quantity" integer DEFAULT '0', "expireDate" date, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "referrerId" uuid, CONSTRAINT "UQ_3aab60cbcf5684b4a89fb46147e" UNIQUE ("code"), CONSTRAINT "PK_367e70f79a9106b8e802e1a9825" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "domain_scheme_enum" AS ENUM('http', 'https')`);
        await queryRunner.query(`CREATE TYPE "domain_enabledstatus_enum" AS ENUM('Enabled', 'Disabled')`);
        await queryRunner.query(`CREATE TABLE "domain" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "scheme" "domain_scheme_enum" NOT NULL DEFAULT 'https', "host" character varying, "customIndexUrl" character varying, "enabledStatus" "domain_enabledstatus_enum" NOT NULL DEFAULT 'Disabled', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "userId" uuid, CONSTRAINT "PK_27e3ec3ea0ae02c8c5bceab3ba9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "user_plantype_enum" AS ENUM('Free', 'Monthly', 'Annual')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying, "emailVerifiedAt" TIMESTAMP, "encryptedPassword" character varying, "billing" json, "authenticatorSecret" character varying, "facebookId" character varying, "lastActiveTill" TIMESTAMP, "planExpirationDate" date, "planTrialDone" boolean NOT NULL DEFAULT false, "planType" "user_plantype_enum" DEFAULT 'Free', "usedReferralsToPurchasePlan" boolean NOT NULL DEFAULT false, "stripeCustomerId" character varying, "language" character varying, "timezone" character varying, "lastIPAddress" character varying, "lastUserAgent" character varying, "country" character varying, "totalLogin" integer NOT NULL DEFAULT '0', "currentBiolinkId" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "planId" integer, "adminRoleId" integer, "registeredByCodeId" uuid, CONSTRAINT "UQ_094936cc710c3c37426eb4d8c21" UNIQUE ("email", "deletedAt"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "follow" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "followerId" uuid, "followeeId" uuid, CONSTRAINT "PK_fda88bc28a84d2d6d06e19df6e5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "link_linktype_enum" AS ENUM('Link', 'Embed', 'Line', 'Social')`);
        await queryRunner.query(`CREATE TABLE "link" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "linkType" "link_linktype_enum" NOT NULL DEFAULT 'Link', "linkTitle" character varying, "linkColor" character varying, "linkImageUrl" character varying DEFAULT 'http://localhost:4000/static/defaultLinkImage.jpg', "platform" character varying, "iconColorful" character varying, "iconMinimal" character varying, "featured" boolean DEFAULT false, "url" character varying, "shortenedUrl" character varying, "order" integer NOT NULL DEFAULT '0', "startDate" date, "endDate" date, "enablePasswordProtection" boolean NOT NULL DEFAULT false, "password" text, "note" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "userId" uuid, "biolinkId" uuid, CONSTRAINT "UQ_d0d8043be438496bc31c73e9ed5" UNIQUE ("shortenedUrl"), CONSTRAINT "PK_26206fb7186da72fbb9eaa3fac9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "message" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "message" character varying, "attachmentUrl" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "senderId" uuid, "chatRoomId" uuid, CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "payment_paymenttype_enum" AS ENUM('Stripe', 'PayPal')`);
        await queryRunner.query(`CREATE TABLE "payment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "paymentType" "payment_paymenttype_enum" NOT NULL DEFAULT 'Stripe', "stripeAmountDue" integer, "stripeAmountPaid" integer, "stripeAmountRemaining" integer, "stripeChargeId" character varying, "stripeInvoiceCreated" character varying, "stripePaymentCurrency" character varying, "stripeCustomerId" character varying, "stripeCustomerAddress" character varying, "stripeCustomerEmail" character varying, "stripeCustomerName" character varying, "stripeCustomerPhone" character varying, "stripeCustomerShipping" character varying, "stripeDiscount" character varying, "stripeInvoicePdfUrl" character varying, "stripeInvoiceUrl" character varying, "stripePriceId" character varying, "stripeSubscriptionId" character varying, "stripeInvoiceNumber" character varying, "stripePeriodStart" date, "stripePeriodEnd" date, "stripeStatus" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_fcaec7df5adf9cac408c686b2ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "plan_enabledstatus_enum" AS ENUM('Enabled', 'Disabled')`);
        await queryRunner.query(`CREATE TABLE "plan" ("id" SERIAL NOT NULL, "name" character varying, "monthlyPrice" double precision NOT NULL DEFAULT '0', "monthlyPriceStripeId" character varying, "annualPrice" double precision NOT NULL DEFAULT '0', "annualPriceStripeId" character varying, "settings" json, "enabledStatus" "plan_enabledstatus_enum" NOT NULL DEFAULT 'Disabled', "visibilityStatus" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "UQ_8aa73af67fa634d33de9bf874ab" UNIQUE ("name"), CONSTRAINT "PK_54a2b686aed3b637654bf7ddbb3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "referral" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "referredByEmail" character varying, "referredByName" character varying, "referredToEmail" character varying, "referredToName" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "referredById" uuid, CONSTRAINT "PK_a2d3e935a6591168066defec5ad" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "report_status_enum" AS ENUM('Pending', 'Resolved', 'Dismissed')`);
        await queryRunner.query(`CREATE TABLE "report" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying, "lastName" character varying, "email" character varying, "reportedUrl" character varying, "description" character varying, "status" "report_status_enum" NOT NULL DEFAULT 'Pending', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "reporterId" uuid, CONSTRAINT "PK_99e4d0bea58cba73c57f935a546" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "settings" ("id" SERIAL NOT NULL, "key" character varying, "value" json, CONSTRAINT "UQ_c8639b7626fa94ba8265628f214" UNIQUE ("key"), CONSTRAINT "PK_0669fe20e252eb692bf4d344975" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "support_status_enum" AS ENUM('Pending', 'Resolved', 'Dismissed')`);
        await queryRunner.query(`CREATE TABLE "support" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "fullName" character varying, "email" character varying, "phoneNumber" character varying, "company" character varying, "subject" character varying, "message" character varying, "status" "support_status_enum" NOT NULL DEFAULT 'Pending', "supportReply" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "userId" uuid, CONSTRAINT "PK_54c6021e6f6912eaaee36b3045d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "tax_valuetype_enum" AS ENUM('Percentage', 'Fixed')`);
        await queryRunner.query(`CREATE TYPE "tax_type_enum" AS ENUM('Inclusive', 'Exclusive')`);
        await queryRunner.query(`CREATE TYPE "tax_billingfor_enum" AS ENUM('Personal', 'Business', 'Personal & Business')`);
        await queryRunner.query(`CREATE TABLE "tax" ("id" SERIAL NOT NULL, "internalName" character varying, "name" character varying, "description" character varying, "value" integer NOT NULL DEFAULT '20', "valueType" "tax_valuetype_enum" NOT NULL DEFAULT 'Fixed', "type" "tax_type_enum" NOT NULL DEFAULT 'Inclusive', "billingFor" "tax_billingfor_enum" NOT NULL DEFAULT 'Personal & Business', "countries" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_2c1e62c595571139e2fb0e9c319" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "token_type_enum" AS ENUM('access_token', 'refresh_token', 'email_verification_token', 'reset_password_token')`);
        await queryRunner.query(`CREATE TABLE "token" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "token" character varying, "type" "token_type_enum" DEFAULT 'refresh_token', "expires" TIMESTAMP, "blacklisted" boolean NOT NULL DEFAULT false, "userId" uuid, CONSTRAINT "PK_82fae97f905930df5d62a702fc9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "track_link" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "ipAddress" character varying, "countryCode" character varying, "cityName" character varying, "osName" character varying, "browserName" character varying, "referer" character varying, "deviceType" character varying, "browserLanguage" character varying, "utmSource" character varying, "utmMedium" character varying, "utmCampaign" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "linkId" uuid, "biolinkId" uuid, CONSTRAINT "PK_7d496873aeb9162f01a67967f7b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "ipAddress" character varying, "cityName" character varying, "countryCode" character varying, "browserName" character varying, "browserLanguage" character varying, "deviceType" character varying, "osName" character varying, "description" character varying, "showInActivity" boolean DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_773dbba6ad8ad2cdecfef243953" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "verification_verificationstatus_enum" AS ENUM('Not Applied', 'Pending', 'Verified', 'Rejected')`);
        await queryRunner.query(`CREATE TABLE "verification" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "verificationStatus" "verification_verificationstatus_enum" NOT NULL DEFAULT 'Pending', "verifiedGovernmentId" boolean DEFAULT false, "verifiedEmail" boolean DEFAULT false, "verifiedPhoneNumber" boolean DEFAULT false, "verifiedWorkEmail" boolean DEFAULT false, "username" character varying, "firstName" character varying, "lastName" character varying, "mobileNumber" character varying, "workNumber" character varying, "email" character varying, "websiteLink" character varying, "instagramUrl" character varying, "twitterUrl" character varying, "linkedinUrl" character varying, "photoIdUrl" character varying, "businessDocumentUrl" character varying, "otherDocumentsUrl" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "userId" uuid, "biolinkId" uuid, "categoryId" integer, CONSTRAINT "REL_7392a9c15c525aed526c19a4c5" UNIQUE ("biolinkId"), CONSTRAINT "PK_f7e3a90ca384e71d6e2e93bb340" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "admin_role" ("id" SERIAL NOT NULL, "roleName" character varying, "roleDescription" character varying, "roleSettings" json, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "UQ_3afb17d33a68887b92dd425ac46" UNIQUE ("roleName"), CONSTRAINT "PK_fd32421f2d93414e46a8fcfd86b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "username" ADD CONSTRAINT "FK_bbd740a15c421eb047c83f84d77" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "username" ADD CONSTRAINT "FK_cf5379446c7770ce52819823aa6" FOREIGN KEY ("biolinkId") REFERENCES "biolink"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "biolink" ADD CONSTRAINT "FK_8c08ae439ea48b8fa5efd17c369" FOREIGN KEY ("usernameId") REFERENCES "username"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "biolink" ADD CONSTRAINT "FK_358886f258e623a560b46ff90c0" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "biolink" ADD CONSTRAINT "FK_02febfa734c6ab397e3477d9d04" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "biolink" ADD CONSTRAINT "FK_d4c935e9f1437f2398b9432464a" FOREIGN KEY ("verificationId") REFERENCES "verification"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat_room_to_user" ADD CONSTRAINT "FK_18de3e42ff2757efe4f60b6d0b4" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat_room_to_user" ADD CONSTRAINT "FK_cb9fad30c77558562dc94bb1689" FOREIGN KEY ("chatRoomId") REFERENCES "chat_room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat_room" ADD CONSTRAINT "FK_f4e2d3c75df8e871e3ccb63d9ed" FOREIGN KEY ("lastMessageSentId") REFERENCES "message"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "code" ADD CONSTRAINT "FK_1d16fe2b4b3993e5a8d26e4909d" FOREIGN KEY ("referrerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "domain" ADD CONSTRAINT "FK_dde349027ada546b854e9fdb5fc" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_40f6ab3925c167d26e52db93cf0" FOREIGN KEY ("planId") REFERENCES "plan"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_3a7597c7b3d26470efb7c2395d4" FOREIGN KEY ("adminRoleId") REFERENCES "admin_role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_3fb14124b42809e57cd35bce0a4" FOREIGN KEY ("registeredByCodeId") REFERENCES "code"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "follow" ADD CONSTRAINT "FK_550dce89df9570f251b6af2665a" FOREIGN KEY ("followerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "follow" ADD CONSTRAINT "FK_38b54e7a93cf8a2f000971a61ed" FOREIGN KEY ("followeeId") REFERENCES "biolink"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "link" ADD CONSTRAINT "FK_14a562b14bb83fc8ba73d30d3e0" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "link" ADD CONSTRAINT "FK_531b91b9ed78f3481ac91659d3e" FOREIGN KEY ("biolinkId") REFERENCES "biolink"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_bc096b4e18b1f9508197cd98066" FOREIGN KEY ("senderId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_f3cc0ca0c4b191410f1e0ab5d21" FOREIGN KEY ("chatRoomId") REFERENCES "chat_room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "FK_b046318e0b341a7f72110b75857" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "referral" ADD CONSTRAINT "FK_fc12cab7df2de5a584c10c57480" FOREIGN KEY ("referredById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "report" ADD CONSTRAINT "FK_253163ca85b927f62596606f6cc" FOREIGN KEY ("reporterId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "support" ADD CONSTRAINT "FK_0768a9a514d90be0f9d00fd8036" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "token" ADD CONSTRAINT "FK_94f168faad896c0786646fa3d4a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "track_link" ADD CONSTRAINT "FK_0bb04d0ddd84ea9304e7beb4824" FOREIGN KEY ("linkId") REFERENCES "link"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "track_link" ADD CONSTRAINT "FK_ffa1c558472efd7b6ab029e584e" FOREIGN KEY ("biolinkId") REFERENCES "biolink"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_logs" ADD CONSTRAINT "FK_21c46c2b3ab66ef0773e5db3464" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "verification" ADD CONSTRAINT "FK_8300048608d8721aea27747b07a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "verification" ADD CONSTRAINT "FK_7392a9c15c525aed526c19a4c5c" FOREIGN KEY ("biolinkId") REFERENCES "biolink"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "verification" ADD CONSTRAINT "FK_5416fe55dabbd4e366b8e46a5c1" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "verification" DROP CONSTRAINT "FK_5416fe55dabbd4e366b8e46a5c1"`);
        await queryRunner.query(`ALTER TABLE "verification" DROP CONSTRAINT "FK_7392a9c15c525aed526c19a4c5c"`);
        await queryRunner.query(`ALTER TABLE "verification" DROP CONSTRAINT "FK_8300048608d8721aea27747b07a"`);
        await queryRunner.query(`ALTER TABLE "user_logs" DROP CONSTRAINT "FK_21c46c2b3ab66ef0773e5db3464"`);
        await queryRunner.query(`ALTER TABLE "track_link" DROP CONSTRAINT "FK_ffa1c558472efd7b6ab029e584e"`);
        await queryRunner.query(`ALTER TABLE "track_link" DROP CONSTRAINT "FK_0bb04d0ddd84ea9304e7beb4824"`);
        await queryRunner.query(`ALTER TABLE "token" DROP CONSTRAINT "FK_94f168faad896c0786646fa3d4a"`);
        await queryRunner.query(`ALTER TABLE "support" DROP CONSTRAINT "FK_0768a9a514d90be0f9d00fd8036"`);
        await queryRunner.query(`ALTER TABLE "report" DROP CONSTRAINT "FK_253163ca85b927f62596606f6cc"`);
        await queryRunner.query(`ALTER TABLE "referral" DROP CONSTRAINT "FK_fc12cab7df2de5a584c10c57480"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "FK_b046318e0b341a7f72110b75857"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_f3cc0ca0c4b191410f1e0ab5d21"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_bc096b4e18b1f9508197cd98066"`);
        await queryRunner.query(`ALTER TABLE "link" DROP CONSTRAINT "FK_531b91b9ed78f3481ac91659d3e"`);
        await queryRunner.query(`ALTER TABLE "link" DROP CONSTRAINT "FK_14a562b14bb83fc8ba73d30d3e0"`);
        await queryRunner.query(`ALTER TABLE "follow" DROP CONSTRAINT "FK_38b54e7a93cf8a2f000971a61ed"`);
        await queryRunner.query(`ALTER TABLE "follow" DROP CONSTRAINT "FK_550dce89df9570f251b6af2665a"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_3fb14124b42809e57cd35bce0a4"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_3a7597c7b3d26470efb7c2395d4"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_40f6ab3925c167d26e52db93cf0"`);
        await queryRunner.query(`ALTER TABLE "domain" DROP CONSTRAINT "FK_dde349027ada546b854e9fdb5fc"`);
        await queryRunner.query(`ALTER TABLE "code" DROP CONSTRAINT "FK_1d16fe2b4b3993e5a8d26e4909d"`);
        await queryRunner.query(`ALTER TABLE "chat_room" DROP CONSTRAINT "FK_f4e2d3c75df8e871e3ccb63d9ed"`);
        await queryRunner.query(`ALTER TABLE "chat_room_to_user" DROP CONSTRAINT "FK_cb9fad30c77558562dc94bb1689"`);
        await queryRunner.query(`ALTER TABLE "chat_room_to_user" DROP CONSTRAINT "FK_18de3e42ff2757efe4f60b6d0b4"`);
        await queryRunner.query(`ALTER TABLE "biolink" DROP CONSTRAINT "FK_d4c935e9f1437f2398b9432464a"`);
        await queryRunner.query(`ALTER TABLE "biolink" DROP CONSTRAINT "FK_02febfa734c6ab397e3477d9d04"`);
        await queryRunner.query(`ALTER TABLE "biolink" DROP CONSTRAINT "FK_358886f258e623a560b46ff90c0"`);
        await queryRunner.query(`ALTER TABLE "biolink" DROP CONSTRAINT "FK_8c08ae439ea48b8fa5efd17c369"`);
        await queryRunner.query(`ALTER TABLE "username" DROP CONSTRAINT "FK_cf5379446c7770ce52819823aa6"`);
        await queryRunner.query(`ALTER TABLE "username" DROP CONSTRAINT "FK_bbd740a15c421eb047c83f84d77"`);
        await queryRunner.query(`DROP TABLE "admin_role"`);
        await queryRunner.query(`DROP TABLE "verification"`);
        await queryRunner.query(`DROP TYPE "verification_verificationstatus_enum"`);
        await queryRunner.query(`DROP TABLE "user_logs"`);
        await queryRunner.query(`DROP TABLE "track_link"`);
        await queryRunner.query(`DROP TABLE "token"`);
        await queryRunner.query(`DROP TYPE "token_type_enum"`);
        await queryRunner.query(`DROP TABLE "tax"`);
        await queryRunner.query(`DROP TYPE "tax_billingfor_enum"`);
        await queryRunner.query(`DROP TYPE "tax_type_enum"`);
        await queryRunner.query(`DROP TYPE "tax_valuetype_enum"`);
        await queryRunner.query(`DROP TABLE "support"`);
        await queryRunner.query(`DROP TYPE "support_status_enum"`);
        await queryRunner.query(`DROP TABLE "settings"`);
        await queryRunner.query(`DROP TABLE "report"`);
        await queryRunner.query(`DROP TYPE "report_status_enum"`);
        await queryRunner.query(`DROP TABLE "referral"`);
        await queryRunner.query(`DROP TABLE "plan"`);
        await queryRunner.query(`DROP TYPE "plan_enabledstatus_enum"`);
        await queryRunner.query(`DROP TABLE "payment"`);
        await queryRunner.query(`DROP TYPE "payment_paymenttype_enum"`);
        await queryRunner.query(`DROP TABLE "message"`);
        await queryRunner.query(`DROP TABLE "link"`);
        await queryRunner.query(`DROP TYPE "link_linktype_enum"`);
        await queryRunner.query(`DROP TABLE "follow"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "user_plantype_enum"`);
        await queryRunner.query(`DROP TABLE "domain"`);
        await queryRunner.query(`DROP TYPE "domain_enabledstatus_enum"`);
        await queryRunner.query(`DROP TYPE "domain_scheme_enum"`);
        await queryRunner.query(`DROP TABLE "code"`);
        await queryRunner.query(`DROP TYPE "code_type_enum"`);
        await queryRunner.query(`DROP TABLE "chat_room"`);
        await queryRunner.query(`DROP TABLE "chat_room_to_user"`);
        await queryRunner.query(`DROP TABLE "category"`);
        await queryRunner.query(`DROP TABLE "black_list"`);
        await queryRunner.query(`DROP TYPE "black_list_blacklisttype_enum"`);
        await queryRunner.query(`DROP TABLE "biolink"`);
        await queryRunner.query(`DROP TYPE "biolink_verificationstatus_enum"`);
        await queryRunner.query(`DROP TABLE "username"`);
        await queryRunner.query(`DROP TYPE "username_premiumtype_enum"`);
    }

}
