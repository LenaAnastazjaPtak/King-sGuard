<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240823203837 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE credentials ADD user_id INT NOT NULL');
        $this->addSql('ALTER TABLE credentials ADD CONSTRAINT FK_FA05280EA76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('CREATE INDEX IDX_FA05280EA76ED395 ON credentials (user_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE credentials DROP FOREIGN KEY FK_FA05280EA76ED395');
        $this->addSql('DROP INDEX IDX_FA05280EA76ED395 ON credentials');
        $this->addSql('ALTER TABLE credentials DROP user_id');
    }
}
